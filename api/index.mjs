import { APP_BASE_HREF } from "@angular/common";
import { CommonEngine } from "@angular/ssr";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "..", "dist", "silenceongrimpe");

export default async function handler(request, response) {
  try {
    const { app } = await import(path.join(distPath, "server", "server.mjs"));
    const engine = new CommonEngine();

    const documentResponse = await engine.render({
      bootstrap: app,
      documentFilePath: path.join(distPath, "browser", "index.html"),
      url: request.url,
      providers: [
        { provide: APP_BASE_HREF, useValue: process.env.APP_BASE_HREF || "/" },
      ],
    });
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
