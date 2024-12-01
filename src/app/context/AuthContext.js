import { createContext, useContext, useState, useEffect } from "react";

// Create Auth Context
const AuthContext = createContext();

// Provide Auth Context
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login function
  const login = () => {
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.clear(); // Remove all items from localStorage
  };

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("customerId");
    if (storedUser) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use Auth Context
export function useAuth() {
  return useContext(AuthContext);
}
