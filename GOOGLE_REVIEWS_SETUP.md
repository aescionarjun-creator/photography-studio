# Google Business Profile Reviews Integration — Setup & Architecture Guide

This guide documents the complete integration architecture, security standards, and configuration steps for syncing official Google Business Profile reviews into the **Subash Studio** digital platform.

---

## 1. Overview & Data Flow Architecture

```
┌────────────────────────────────────────────────────────┐
│             Google Business Profile                   │
│          (Verified Studio Location & Reviews)         │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼ (Official Google Reviews API)
┌────────────────────────────────────────────────────────┐
│                Secure Backend / API Layer             │
│            (Node.js / Vite Middleware / Vercel)        │
│    - Private OAuth Token Exchange                     │
│    - Encrypted / Server-Only Refresh Token Storage     │
│    - Review Normalization to Studio Data Model         │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼ (Normalized Reviews Payload)
┌────────────────────────────────────────────────────────┐
│           Admin Panel (Testimonials Manager)           │
│    - Status: Connected / Not Connected / Not Configured│
│    - One-Click Sync & Deduplication                    │
│    - Moderation: Approve / Hide / Feature             │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼ (Approved & Unhidden Reviews)
┌────────────────────────────────────────────────────────┐
│               Public Website Carousel                  │
│       (TestimonialsCarousel.jsx on Home Page)          │
│    - Luxury Editorial Design System                    │
│    - Unified Manual & Verified Google Client Reviews   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Google Cloud Platform Setup

### Step 1: Create or Select a Google Cloud Project
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `subash-studio-platform`) or select an existing project.

### Step 2: Request Google Business Profile API Access
> [!IMPORTANT]
> Google requires Business Profile API access approval. The Google account authorizing the integration must be an **Owner** or **Manager** of the verified Subash Studio location on Google Maps / Google Business Profile.

1. Review Google's official requirements at [Google Business Profile APIs](https://developers.google.com/my-business).
2. Ensure your account is authorized to manage the Google Business Profile location.

### Step 3: Enable the Required APIs
In the Google Cloud Console, navigate to **APIs & Services → Library** and enable:
- **My Business Account Management API** (`mybusinessaccountmanagement.googleapis.com`)
- **My Business Business Information API** (`mybusinessbusinessinformation.googleapis.com`)
- **Google My Business API (v4)** (`mybusiness.googleapis.com`)

---

## 3. OAuth 2.0 Credentials Configuration

### Step 1: Configure the OAuth Consent Screen
1. Go to **APIs & Services → OAuth consent screen**.
2. User Type: Select **External** (or Internal for Google Workspace organizations).
3. App information:
   - App name: `Subash Studio`
   - User support email: Studio director email
   - Developer contact email: Studio director email
4. Scopes: Add the required Business Profile management scope:
   - `https://www.googleapis.com/auth/business.manage`

### Step 2: Create an OAuth 2.0 Client ID
1. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. Application type: **Web application**.
3. Name: `Subash Studio Web App`.
4. **Authorized JavaScript origins**:
   - Development: `http://localhost:5173`
   - Production: `https://your-custom-domain.com`
5. **Authorized redirect URIs**:
   - Development: `http://localhost:5173/api/auth/google/callback`
   - Production: `https://your-custom-domain.com/api/auth/google/callback`
6. Copy your **Client ID** and **Client Secret**.

---

## 4. Environment Variables

Create or update your server `.env` file in the project root:

```env
# Google Cloud OAuth 2.0 Credentials (Server-only — NEVER prefix with VITE_)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Redirect URI (must match the authorized redirect URI in Google Cloud Console)
GOOGLE_REDIRECT_URI=http://localhost:5173/api/auth/google/callback

# Optional overrides (auto-discovered if omitted):
GOOGLE_BUSINESS_ACCOUNT_ID=
GOOGLE_BUSINESS_LOCATION_ID=

# Production serverless refresh token (optional, populated after connection):
GOOGLE_REFRESH_TOKEN=
```

---

## 5. How to Connect in the Admin Panel

1. Start your local dev server: `npm run dev`.
2. Log in to the Admin Panel (`/admin`) and navigate to **Testimonials** (`/admin/testimonials`).
3. If credentials are not yet added, the integration banner displays:
   `Integration Status: NOT CONFIGURED`.
4. Once environment variables are present, the banner shows:
   `Integration Status: NOT CONNECTED` with a **Connect Google Business Profile** button.
5. Click **Connect Google Business Profile**. You will be redirected to Google's consent screen.
6. Authorize with the Google account that manages the Subash Studio Business Profile.
7. Upon successful authorization, you will be redirected back to the Admin Panel with a confirmation toast:
   `Google Business Profile connected successfully!`
8. The banner updates to **Connected** with studio location metadata and last synced timestamp.

---

## 6. How Syncing & Moderation Works

### One-Click Sync
- Click **Sync Google Reviews** (or **Sync Now**).
- The system fetches reviews directly from Google's official Reviews API.
- Deduplication runs automatically based on `googleReviewId`.
- Existing reviews are updated if the rating, client text, or studio reply changed on Google.
- Manual testimonials are completely preserved.

### Admin Approval & Moderation
- **New Google Reviews** default to `approved: false` (Pending).
- They **do NOT** appear on the public Home page until explicitly approved by the studio director.
- In Admin Testimonials:
  - Click the **Eye / Check** button to approve or hide a review.
  - Click the **Star** button to mark or unmark it as **Featured**.
  - Click **View on Google** to view the live review on Google Maps / Search.
  - Filter by tabs: `All`, `Manual`, `Google Reviews`, `Pending`, `Approved`, `Featured`.

---

## 7. Public Presentation (`TestimonialsCarousel.jsx`)

- Located on the Subash Studio Home page (`/`).
- Consumes unified testimonial state from `AdminDataContext`.
- Shows **only** reviews that have `approved === true` and `hidden !== true`.
- Prioritizes `featured === true` stories at the front of the carousel.
- Both manual testimonials and Google reviews share the same luxury editorial design system:
  - Warm White (`#F8F6F2`)
  - Champagne Gold (`#C9A669`)
  - Rich Charcoal (`#2B2B2B`)
  - Fraunces serif headings & Manrope body typography
  - Circular avatar with initials fallback
  - Verified Google badge on Google reviews

---

## 8. Security Architecture & Rules

> [!CAUTION]
> The following security constraints are strictly enforced in code:

1. **No Client-Side Secrets**:
   `GOOGLE_CLIENT_SECRET` and refresh tokens are handled exclusively by Node.js server-side code (`server/google/`). They are **never** prefixed with `VITE_` and never bundled into client scripts.
2. **No LocalStorage Token Leakage**:
   Refresh tokens are **never** stored in browser `localStorage`. Local development stores tokens server-side in `server/.google_token.json` (which is excluded in `.gitignore`). In production, tokens are managed via environment variables (`GOOGLE_REFRESH_TOKEN`).
3. **No Unsanitized API Exposure**:
   Public endpoints return sanitized review text, star ratings, reviewer names, and public avatar URLs. Raw OAuth tokens and internal Google response headers are never leaked.
4. **Resilient Offline / Fallback States**:
   If credentials are missing or network requests fail, the application gracefully shows clear diagnostic states without breaking the public Home page or manual admin testimonial management.

---

## 9. Future Enhancements

- **Real-Time Webhooks**: The codebase is architected so that the **Google Business Profile Notifications API** (Cloud Pub/Sub push subscription) can be wired into `server/google/apiHandlers.js` to automatically ingest new reviews the moment a client posts them on Google.
