import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    status: "not logged in",
    username: null,
    permissions: null,
  });

  const login = (username, permissions) => {
    setAuthState({
      status: "logged in",
      username,
      permissions,
    });
  };

  const logout = () => {
    setAuthState({
      status: "not logged in",
      username: null,
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
