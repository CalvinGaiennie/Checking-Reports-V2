import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    // Initialize state from localStorage
    const savedAuth = localStorage.getItem("authState");
    return savedAuth
      ? JSON.parse(savedAuth)
      : {
          status: "not logged in",
          userId: null,
          username: null,
          permissions: null,
        };
  });

  // Save to localStorage whenever authState changes
  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(authState));
  }, [authState]);

  const login = (username, permissions, userId) => {
    setAuthState({
      status: "logged in",
      userId,
      username,
      permissions,
    });
  };

  const logout = () => {
    setAuthState({
      status: "not logged in",
      username: null,
      userId: null,
      permissions: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
