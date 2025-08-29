import "@angular/compiler";
import { APP_BASE_HREF } from "@angular/common";
import { renderApplication } from "@angular/platform-server";
import { provideClientHydration } from "@angular/platform-browser";
import path from "path";
import fs from "fs/promises";

// Chemins vers les dossiers Angular dans Vercel
const BROWSER_PATH = "/var/task/dist/silenceongrimpe/browser";
const SERVER_PATH = "/var/task/dist/silenceongrimpe/server";

// Fonction handler appelée par Vercel
export default async function handler(request, response) {
  try {
    // Charger le index.html généré par Angular
    const indexHtml = await fs.readFile(
      path.join(BROWSER_PATH, "index.html"),
      "utf-8"
    );

    // Importer le module serveur Angular (SSR)
    const serverModule = await import(path.join(SERVER_PATH, "main.js"));
    const app = serverModule.app || serverModule.default;

    // Générer le HTML avec SSR
    const html = await renderApplication(app, {
      document: indexHtml,
      url: request.url,
      platformProviders: [
        { provide: APP_BASE_HREF, useValue: process.env.APP_BASE_HREF || "/" },
      ],
      providers: [provideClientHydration()],
    });

    response.setHeader("Content-Type", "text/html");
    response.status(200).send(html);
  } catch (error) {
    console.error("SSR error:", error);
    response.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}