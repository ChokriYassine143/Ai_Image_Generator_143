
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

// Define a type that mimics the Firebase User interface for local testing
export interface LocalUser {
  email: string;
  id: string;
  displayName?: string;
  emailVerified?: boolean;
  isAnonymous?: boolean;
  metadata?: object;
  providerData?: object[];
  [key: string]: any; // Allow additional properties
}

export const localAuthHelpers = {
  signUp: async (email: string, password: string): Promise<LocalUser> => {
    const user: LocalUser = { 
      email, 
      id: Date.now().toString(),
      emailVerified: false,
      isAnonymous: false,
      displayName: email.split('@')[0],
      metadata: {},
      providerData: []
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  },
  
  login: async (email: string, password: string): Promise<LocalUser> => {
    // For testing, accept any email/password combination
    const user: LocalUser = { 
      email, 
      id: Date.now().toString(),
      emailVerified: true,
      isAnonymous: false,
      displayName: email.split('@')[0],
      metadata: {},
      providerData: []
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  },
  
  googleLogin: async (): Promise<LocalUser> => {
    const user: LocalUser = { 
      email: 'test@google.com', 
      id: Date.now().toString(),
      emailVerified: true,
      isAnonymous: false,
      displayName: 'Test Google User',
      metadata: {},
      providerData: [{ providerId: 'google.com' }]
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  },
  
  logout: async () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  },
  
  getCurrentUser: (): LocalUser | null => {
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
