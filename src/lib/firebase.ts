
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/storage";
import { getStorage } from "firebase/storage";

// Temporary mock Firebase config for local development
const firebaseConfig = {
  apiKey: "TEST-API-KEY",
  authDomain: "test-domain.firebaseapp.com",
  projectId: "test-projectid",
  storageBucket: "test-bucket.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// Local Storage Authentication Helper Functions
const LOCAL_STORAGE_USER_KEY = 'auth_user';

export const localAuthHelpers = {
  signUp: async (email: string, password: string) => {
    const user = { email, id: Date.now().toString() };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  },
  
  login: async (email: string, password: string) => {
    // For testing, accept any email/password combination
    const user = { email, id: Date.now().toString() };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  },
  
  googleLogin: async () => {
    const user = { email: 'test@google.com', id: Date.now().toString() };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  },
  
  logout: async () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
  
  forgotPassword: async (email: string) => {
    // Mock password reset for testing
    console.log('Password reset email sent to:', email);
    return true;
  }
};

export { auth, googleProvider, db, storage };
