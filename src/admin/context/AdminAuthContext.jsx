import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminAuthContext = createContext(null);

const AUTH_STORAGE_KEY = "subash_studio_admin_auth";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

const ALLOWED_ADMIN_CREDENTIALS = [
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

        const matched = ALLOWED_ADMIN_CREDENTIALS.find(
          (c) => c.email === cleanEmail && c.password === cleanPassword
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

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        loading,
        login,
        logout,
        updateProfile,
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
