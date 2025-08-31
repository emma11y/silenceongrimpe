// api/revalidate.js (Vercel serverless function)
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  // Sécurité
  const auth = req.headers["authorization"];
  if (!auth || auth !== `Bearer ${process.env.DEPLOY_SECRET}`) {
    return res
      .status(403)
      .json({ error: "Forbidden", auth, secret: process.env.DEPLOY_SECRET });
  }

  try {
    const { operation, slug, old_slug, new_slug } = req.body;
    console.log("🔔 Revalidate:", operation, slug || new_slug);

    // Invalidation ciblée
    if (operation === "INSERT") {
      await res.revalidate(`/actualites/${slug}`);
    } else if (operation === "UPDATE") {
      if (old_slug && old_slug !== new_slug) {
        await res.revalidate(`/actualites/${old_slug}`);
      }
      await res.revalidate(`/actualites/${new_slug}`);
    } else if (operation === "DELETE") {
      await res.revalidate(`/actualites/${slug}`);
    }

    return res.json({ ok: true, revalidated: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error revalidating" });
  }
}
