import { createContext, useContext, useState, useEffect } from "react";

// Create Auth Context
const AuthContext = createContext();

// Provide Auth Context
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Login function
  const login = (token, user) => {
    localStorage.setItem("token", token); // Lưu token vào localStorage
    localStorage.setItem("customerId", user.id); // Lưu customerId vào localStorage
    localStorage.setItem("roleId", user.role_id); // Lưu customerId vào localStorage
    setUser(user); // Cập nhật user state
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
    localStorage.removeItem("customerId"); // Xóa customerId khỏi localStorage
    setUser(null); // Đặt lại state user
    setIsAuthenticated(false); // Đánh dấu là chưa đăng nhập
  };

  // Check if token exists and is valid
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Giải mã token để lấy thông tin user
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Giải mã payload
      if (decodedToken.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
        setUser({ id: decodedToken.id, name: decodedToken.name, role: decodedToken.role_id });
      } else {
        logout(); // Nếu token hết hạn thì logout
      }
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
