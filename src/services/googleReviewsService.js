/**
 * Client-side service for Google Business Profile Reviews API.
 * Calls only the secure backend endpoints without exposing any credentials.
 */

export async function fetchGoogleIntegrationStatus() {
  try {
    const res = await fetch("/api/google-reviews/status");
    if (!res.ok) {
      return {
        configured: false,
        connected: false,
        status: "NOT_CONFIGURED",
        message: "Google Reviews API endpoint returned an error.",
      };
    }
    return await res.json();
  } catch (err) {
    return {
      configured: false,
      connected: false,
      status: "NOT_CONFIGURED",
      message: err.message || "Could not reach Google Reviews API service.",
    };
  }
}

export async function getGoogleOAuthUrl() {
  const res = await fetch("/api/auth/google/url");
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || "Failed to generate Google authorization URL.");
  }
  return data.url;
}

export async function disconnectGoogleAccount() {
  const res = await fetch("/api/auth/google/disconnect", { method: "POST" });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || "Failed to disconnect Google account.");
  }
  return data;
}

export async function fetchGoogleReviewsFromApi() {
  const res = await fetch("/api/google-reviews");
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.message || data.error || "Failed to fetch Google reviews.");
  }
  return data;
}
