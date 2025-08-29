import { APP_BASE_HREF } from "@angular/common";
import { renderApplication } from "@angular/platform-server";
import { provideClientHydration } from "@angular/platform-browser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "..", "dist", "silenceongrimpe");

export default async function handler(request, response) {
  try {
    const indexHtml = await fs.readFile(
      path.join(distPath, "browser", "index.html"),
      "utf-8"
    );
    const { app } = await import(path.join(distPath, "server", "server.mjs"));

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
