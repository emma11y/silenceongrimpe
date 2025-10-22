// prerender-routes.js (à la racine)
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xougupyvckqdjqtkyqyr.supabase.co";
const SUPABASE_SERVICE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvdWd1cHl2Y2txZGpxdGt5cXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA5ODAsImV4cCI6MjA2ODI1Njk4MH0.PdDCh0qa-jgQr8D1fNUAszqI9ftngvnAZgucsDUREjw";

// Chemins des fichiers
const CACHE_FILE = path.resolve(".cache/prerender-routes.txt");
const CACHE_TTL = 60 * 60 * 1000; // 1h

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ANON_KEY);

async function fetchSlugs() {
  const { data, error } = await supabase
    .from("actualites")
    .select("slug")
    .eq("publie", true);
  if (error) throw error;
  return data.map((r) => `/actualites/${r.slug}`);
}

async function main() {
  try {
    // cache
    if (fs.existsSync(CACHE_FILE)) {
      const age = Date.now() - fs.statSync(CACHE_FILE).mtimeMs;
      if (age < CACHE_TTL) {
        console.log("⚡ Routes depuis cache local");
        const cached = fs.readFileSync(CACHE_FILE, "utf-8");
        fs.writeFileSync("prerender-routes.txt", cached);
        return;
      }
    }

    console.log("⏳ Récupération des slugs depuis Supabase...");
    const routes = [
      "/",
      "/collectif",
      "/agenda",
      "/contact",
      "/mentions-legales",
      "/actualites",
      "/videos",
      ...(await fetchSlugs()),
    ];

    fs.mkdirSync(".cache", { recursive: true });
    fs.writeFileSync(CACHE_FILE, routes.join("\n"));
    fs.writeFileSync("prerender-routes.txt", routes.join("\n"));

    console.log(`✅ ${routes.length} routes générées`);
  } catch (e) {
    console.error("❌ Erreur routes", e);
    // fallback cache
    if (fs.existsSync(CACHE_FILE)) {
      console.log("⚠️ Fallback cache");
      const cached = fs.readFileSync(CACHE_FILE, "utf-8");
      fs.writeFileSync("prerender-routes.txt", cached);
    } else {
      process.exit(1);
    }
  }
}
main();
