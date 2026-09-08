import { handleGoogleApiRequest } from "./apiHandlers.js";

/**
 * Vite plugin that mounts the Google Business Profile API middleware on Vite's dev server.
 * This handles /api/google-reviews and /api/auth/google/* directly in Node.js during development.
 */
export function googleApiMiddleware() {
  return {
    name: "vite-plugin-google-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (
          req.url &&
          (req.url.startsWith("/api/google-reviews") || req.url.startsWith("/api/auth/google"))
        ) {
          const handled = await handleGoogleApiRequest(req, res);
          if (handled) return;
        }
        next();
      });
    },
  };
}
