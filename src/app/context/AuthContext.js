import { createContext, useContext, useState, useEffect } from "react";

// Create Auth Context
const AuthContext = createContext();

// Provide Auth Context
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Store user details

  // Login function
  const login = (userData) => {
    setUser(userData); // Set user details
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData)); // Persist user data
  };

  // Logout function
  const logout = () => {
    setUser(null); // Clear user details
    setIsAuthenticated(false);
    localStorage.removeItem("user"); // Remove user data from storage
  };

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Restore user details
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use Auth Context
export function useAuth() {
  return useContext(AuthContext);
}
