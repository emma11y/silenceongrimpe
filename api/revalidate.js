// api/revalidate.js (Vercel serverless function)
export default async function handler(req, res) {
  // Vérification de la méthode HTTP
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Vérification de l'authentification
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.DEPLOY_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Validation du corps de la requête
    const { operation, slug, old_slug, new_slug } = req.body;

    if (!operation || !["INSERT", "UPDATE", "DELETE"].includes(operation)) {
      return res.status(400).json({ error: "Invalid operation" });
    }
    console.log("🔔 Revalidation demandée:", {
      operation,
      slug,
      old_slug,
      new_slug,
    });

    try {
      // Invalidation ciblée selon l'opération
      switch (operation) {
        case "INSERT":
          if (!slug) {
            return res
              .status(400)
              .json({ error: "Slug required for INSERT operation" });
          }
          await res.revalidate(`/actualites/${slug}`);
          break;

        case "UPDATE":
          if (!new_slug) {
            return res
              .status(400)
              .json({ error: "new_slug required for UPDATE operation" });
          }
          // Si l'ancien slug existe et est différent, on revalide aussi son URL
          if (old_slug && old_slug !== new_slug) {
            await res.revalidate(`/actualites/${old_slug}`);
          }
          await res.revalidate(`/actualites/${new_slug}`);
          break;

        case "DELETE":
          if (!slug) {
            return res
              .status(400)
              .json({ error: "Slug required for DELETE operation" });
          }
          await res.revalidate(`/actualites/${slug}`);
          break;
      }

      return res.json({
        ok: true,
        revalidated: true,
        operation,
        paths:
          old_slug && old_slug !== new_slug
            ? [`/actualites/${old_slug}`, `/actualites/${new_slug}`]
            : [`/actualites/${slug || new_slug}`],
      });
    } catch (error) {
      console.error("❌ Erreur de revalidation:", error);
      return res.status(500).json({
        error: "Error revalidating",
        message: error.message,
      });
    }
  } catch (error) {
    console.error("❌ Erreur générale:", error);
    return res.status(500).json({
      error: "General error",
      message: error.message,
    });
  }
}
