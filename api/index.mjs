import "@angular/compiler";
import { APP_BASE_HREF } from "@angular/common";
import { renderApplication } from "@angular/platform-server";
import { provideClientHydration } from "@angular/platform-browser";
import path from "path";
import fs from "fs/promises";

// Chemins vers les dossiers de build dans Vercel
const BROWSER_PATH = "/var/task/dist/silenceongrimpe/browser";
const SERVER_PATH = "/var/task/dist/silenceongrimpe/server";

// Fonction de débogage pour l'environnement
const debugEnvironment = async () => {
  try {
    console.log("Current working directory:", process.cwd());
    console.log("Directory contents:", await fs.readdir(process.cwd()));
    if (await fs.stat("/var/task").catch(() => false)) {
      console.log("/var/task contents:", await fs.readdir("/var/task"));
    }
    if (await fs.stat(BROWSER_PATH).catch(() => false)) {
      console.log("BROWSER_PATH contents:", await fs.readdir(BROWSER_PATH));
    }
    if (await fs.stat(SERVER_PATH).catch(() => false)) {
      console.log("SERVER_PATH contents:", await fs.readdir(SERVER_PATH));
    }
  } catch (error) {
    console.error("Debug error:", error);
  }
};

export default async function handler(request, response) {
  try {
    // Log de débogage au début du handler
    await debugEnvironment();

    const indexHtml = await fs.readFile(
      path.join(DIST_PATH, "index.html"),
      "utf-8"
    );
    const { app } = await import(path.join(DIST_PATH, "server.mjs"));

    const html = await renderApplication(app, {
      document: indexHtml,
      url: request.url,
      platformProviders: [
        { provide: APP_BASE_HREF, useValue: process.env.APP_BASE_HREF || "/" },
      ],
      providers: [provideClientHydration()],
    });

    response.setHeader("Content-Type", "text/html");
    return response.send(html);
  } catch (error) {
    console.error("Error handling request:", error);
    console.error("Stack trace:", error.stack);
    console.error("Current directory:", __dirname);
    console.error("Attempted dist path:", distPath);

    return response.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      debug: {
        currentDir: __dirname,
        distPath: distPath,
      },
    });
  }
}
