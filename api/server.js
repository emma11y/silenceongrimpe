import { createServerHandler } from "@angular/ssr";
import { app } from "../dist/silenceongrimpe/server/server.mjs";

export default async function handler(request, response) {
  try {
    const serverHandler = await createServerHandler(app);
    return await serverHandler(request, response);
  } catch (error) {
    console.error("Error handling request:", error);
    return response.status(500).send("Internal Server Error");
  }
}
