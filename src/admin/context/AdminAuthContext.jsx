import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminAuthContext = createContext(null);

const AUTH_STORAGE_KEY = "subash_studio_admin_auth";
const CREDENTIALS_STORAGE_KEY = "subash_studio_admin_credentials";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

const DEFAULT_ALLOWED_ADMIN_CREDENTIALS = [
  {
    email: (import.meta.env?.VITE_ADMIN_EMAIL || "admin@subashstudio.com").toLowerCase(),
    password: import.meta.env?.VITE_ADMIN_PASSWORD || "subash@2026",
    name: "Subash",
    role: "Studio Director & Founder",
    avatar: "/images/admin/profile.png",
  },
  {
    email: "subashstudio009@gmail.com",
    password: import.meta.env?.VITE_ADMIN_PASSWORD || "subash@2026",
    name: "Subash",
    role: "Studio Director & Founder",
    avatar: "/images/admin/profile.png",
  },
];

export function getStoredCredentials() {
  try {
    const stored = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (!stored) return DEFAULT_ALLOWED_ADMIN_CREDENTIALS;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn("Failed to read credentials from storage:", err);
  }
  return DEFAULT_ALLOWED_ADMIN_CREDENTIALS;
}

const DEFAULT_ADMIN_USER = {
  name: "Subash",
  email: "subashstudio009@gmail.com",
  role: "Studio Director & Founder",
  avatar: "/images/admin/profile.png",
};

function safeParseAuth(stored) {
  if (!stored || typeof stored !== "string") return null;
  const trimmed = stored.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;
  try {
    const data = JSON.parse(trimmed);
    if (!data || !data.token) return null;
    // Enforce session expiration
    if (data.expiresAt && Date.now() > data.expiresAt) {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
        // Fallback
      }
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      const parsed = safeParseAuth(stored);
      return Boolean(parsed?.token);
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      const parsed = safeParseAuth(stored);
      if (parsed?.user) return parsed.user;
    } catch {
      // Fallback
    }
    return DEFAULT_ADMIN_USER;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password, rememberMe = true) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);
        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanPassword = (password || "").trim();

        if (!cleanEmail || !cleanPassword) {
          reject(new Error("Please enter both email and password."));
          return;
        }

        const credentials = getStoredCredentials();
        const matched = credentials.find(
          (c) => c.email.toLowerCase() === cleanEmail && c.password === cleanPassword
        );

        if (!matched) {
          reject(new Error("Invalid email or password. Please check your credentials."));
          return;
        }

        const user = {
          name: matched.name,
          email: matched.email,
          role: matched.role,
          avatar: matched.avatar,
        };

        const session = {
          token: "jwt_subash_" + Math.random().toString(36).substring(2) + Date.now(),
          user,
          expiresAt: Date.now() + SESSION_DURATION_MS,
        };

        if (rememberMe) {
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
          } catch {
            // Fallback
          }
        }
        setIsAuthenticated(true);
        setAdminUser(user);
        resolve(user);
      }, 500);
    });
  };

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Fallback
    }
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedData) => {
    setAdminUser((prev) => {
      const next = { ...prev, ...updatedData };
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        const parsed = safeParseAuth(stored);
        if (parsed) {
          localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ ...parsed, user: next })
          );
        }
      } catch {
        // Fallback
      }
      return next;
    });
  };

  const changePassword = async (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanCurrent = (currentPassword || "").trim();
        const cleanNew = (newPassword || "").trim();

        if (!cleanCurrent) {
          reject(new Error("Please enter your current password."));
          return;
        }
        if (!cleanNew) {
          reject(new Error("Please enter a new password."));
          return;
        }
        if (cleanNew.length < 4) {
          reject(new Error("New password must be at least 4 characters long."));
          return;
        }

        const credentials = getStoredCredentials();
        const userEmail = (adminUser?.email || "").toLowerCase().trim();

        // Verify that current password matches stored credentials
        const isValidCurrent = credentials.some(
          (c) =>
            c.password === cleanCurrent &&
            (!userEmail || c.email.toLowerCase() === userEmail || c.name === "Subash")
        );

        if (!isValidCurrent) {
          reject(
            new Error("Current password is incorrect. Please verify your current password.")
          );
          return;
        }

        // Update credentials with new password
        const updatedCredentials = credentials.map((c) => {
          if (!userEmail || c.email.toLowerCase() === userEmail || c.password === cleanCurrent || c.name === "Subash") {
            return { ...c, password: cleanNew };
          }
          return c;
        });

        try {
          localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(updatedCredentials));
        } catch (err) {
          console.error("Failed to save credentials to storage:", err);
        }

        // Keep active session alive with updated timestamp
        try {
          const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
          const parsed = safeParseAuth(storedAuth);
          if (parsed?.user) {
            localStorage.setItem(
              AUTH_STORAGE_KEY,
              JSON.stringify({ ...parsed, expiresAt: Date.now() + SESSION_DURATION_MS })
            );
          }
        } catch {
          // Fallback
        }

        resolve(true);
      }, 300);
    });
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        loading,
        login,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

export function ProtectedAdminRoute({ children }) {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
