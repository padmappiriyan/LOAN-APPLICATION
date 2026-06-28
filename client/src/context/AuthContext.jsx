import { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true = checking session on startup

  const setUserData = useCallback((userData) => {
    setUser(userData);
    setIsLoading(false);
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    setIsLoading(false);
  }, []);

  // Expose clearUser globally for Axios interceptor to call on refresh failure
  useEffect(() => {
    window.__AUTH_CONTEXT_CLEAR = clearUser;
    return () => { delete window.__AUTH_CONTEXT_CLEAR; };
  }, [clearUser]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    mustChangePassword: user?.mustChangePassword ?? false,
    setUserData,
    clearUser,
    setIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
