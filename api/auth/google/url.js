import { handleGoogleApiRequest } from "../../../server/google/apiHandlers.js";

export default async function handler(req, res) {
  const handled = await handleGoogleApiRequest(req, res);
  if (!handled) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  }
}
