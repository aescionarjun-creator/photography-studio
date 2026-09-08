import {
  getIntegrationStatus,
  getAuthorizationUrl,
  handleOAuthCallback,
  clearServerRefreshToken,
  fetchGoogleReviews,
} from "./googleBusinessProfile.js";

/**
 * Dispatches an HTTP request to the appropriate Google Business Profile action.
 * Can be used by Vite dev server middleware and serverless function handlers.
 *
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 * @returns {Promise<boolean>} returns true if the request was handled, false otherwise
 */
export async function handleGoogleApiRequest(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = urlObj.pathname;

  // Helper to send JSON
  const sendJson = (status, payload) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(payload));
  };

  try {
    // 1. Check Status
    if (pathname === "/api/google-reviews/status" && req.method === "GET") {
      const status = getIntegrationStatus();
      sendJson(200, status);
      return true;
    }

    // 2. Get OAuth Authorization URL
    if (pathname === "/api/auth/google/url" && req.method === "GET") {
      const origin = `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`;
      try {
        const url = getAuthorizationUrl(origin);
        sendJson(200, { url });
      } catch (err) {
        sendJson(400, { error: err.message });
      }
      return true;
    }

    // 3. OAuth Callback
    if (pathname === "/api/auth/google/callback" && req.method === "GET") {
      const code = urlObj.searchParams.get("code");
      const error = urlObj.searchParams.get("error");
      const origin = `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`;

      if (error) {
        res.statusCode = 302;
        res.setHeader("Location", `/admin/testimonials?google_error=${encodeURIComponent(error)}`);
        res.end();
        return true;
      }

      if (!code) {
        res.statusCode = 302;
        res.setHeader("Location", "/admin/testimonials?google_error=Missing+authorization+code");
        res.end();
        return true;
      }

      try {
        await handleOAuthCallback(code, origin);
        res.statusCode = 302;
        res.setHeader("Location", "/admin/testimonials?google_connected=1");
        res.end();
      } catch (err) {
        res.statusCode = 302;
        res.setHeader("Location", `/admin/testimonials?google_error=${encodeURIComponent(err.message)}`);
        res.end();
      }
      return true;
    }

    // 4. Disconnect OAuth
    if (pathname === "/api/auth/google/disconnect" && (req.method === "POST" || req.method === "GET")) {
      clearServerRefreshToken();
      sendJson(200, { success: true, message: "Google Business Profile disconnected." });
      return true;
    }

    // 5. Fetch / Sync Reviews
    if (
      (pathname === "/api/google-reviews" || pathname === "/api/google-reviews/sync") &&
      (req.method === "GET" || req.method === "POST")
    ) {
      const result = await fetchGoogleReviews();
      sendJson(200, result);
      return true;
    }

    return false;
  } catch (err) {
    sendJson(500, {
      error: true,
      message: err.message || "An error occurred while communicating with Google Reviews API.",
    });
    return true;
  }
}
