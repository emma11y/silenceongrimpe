import { createServerHandler } from "@angular/ssr";

export default async function handler(request, response) {
  try {
    const { app } = await import("../dist/silenceongrimpe/server/server.mjs");
    const serverHandler = await createServerHandler(app);
    return await serverHandler(request, response);
  } catch (error) {
    console.error("Error handling request:", error);
    return response.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
