
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth, googleProvider, localAuthHelpers, LocalUser } from "@/lib/firebase";

// Create a union type that can be either Firebase User or our LocalUser
type AuthUser = User | LocalUser;

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user on mount
    const user = localAuthHelpers.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string) => {
    const user = await localAuthHelpers.signUp(email, password);
    setCurrentUser(user);
  };

  const login = async (email: string, password: string) => {
    const user = await localAuthHelpers.login(email, password);
    setCurrentUser(user);
  };

  const logout = async () => {
    await localAuthHelpers.logout();
    setCurrentUser(null);
  };

  const googleLogin = async () => {
    const user = await localAuthHelpers.googleLogin();
    setCurrentUser(user);
  };

  const forgotPassword = async (email: string) => {
    await localAuthHelpers.forgotPassword(email);
  };

  const value = {
    currentUser,
    loading,
    signUp,
    login,
    logout,
    googleLogin,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
