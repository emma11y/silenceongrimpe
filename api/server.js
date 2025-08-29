import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createServerHandler } from "@angular/ssr";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, "..", "dist", "silenceongrimpe");
const browserPath = join(distPath, "browser");
const serverPath = join(distPath, "server", "server.mjs");

let appPromise;

async function getApp() {
  if (!appPromise) {
    try {
      const { app } = await import(serverPath);
      appPromise = app;
    } catch (error) {
      console.error("Failed to load app:", error);
      throw error;
    }
  }
  return appPromise;
}

export default async function handler(request, response) {
  try {
    const app = await getApp();
    const serverHandler = await createServerHandler(app, {
      documentRoot: browserPath,
      indexHtml: join(browserPath, "index.html"),
      publicPath: "/browser/",
    });

    return await serverHandler(request, response);
  } catch (error) {
    console.error("Error handling request:", error);
    console.error("Error details:", error.stack);
    return response.status(500).send("Internal Server Error");
  }
}
