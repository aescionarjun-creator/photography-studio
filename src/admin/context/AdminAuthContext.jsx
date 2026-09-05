import { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminAuthContext = createContext(null);

const AUTH_STORAGE_KEY = "subash_studio_admin_auth";

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
    return JSON.parse(trimmed);
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
    // Simulated JWT login response (ready for REST API POST /api/auth/login)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);
        // Clean validation
        if (!email || !password) {
          reject(new Error("Please enter both email and password"));
          return;
        }

        // Demo credentials check (accepts demo user or standard subash studio admin credentials)
        const user = {
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
          email: email,
          role: "Studio Director",
          avatar: "/images/admin/profile.png",
        };

        const session = {
          token: "jwt_demo_token_" + Date.now(),
          user,
        };

        if (rememberMe) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        }
        setIsAuthenticated(true);
        setAdminUser(user);
        resolve(user);
      }, 700);
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
