
# Firebase Implementation Guide

## Prerequisites
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication methods (Email/Password and Google Sign-in)
3. Set up Firestore Database
4. Set up Storage for image uploads

## Configuration Steps

### 1. Firebase Configuration
Replace the temporary config in `src/lib/firebase.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 2. Enable Authentication Methods
1. Go to Firebase Console > Authentication > Sign-in methods
2. Enable Email/Password authentication
3. Enable Google authentication
4. Add your domain to authorized domains

### 3. Set Up Firestore Rules
In Firebase Console > Firestore Database > Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userImages/{document} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 4. Set Up Storage Rules
In Firebase Console > Storage > Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /user-images/{userId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Project Structure

The Firebase implementation is organized as follows:

1. `src/lib/firebase.ts` - Main Firebase configuration and initialization
2. `src/contexts/AuthContext.tsx` - Authentication context provider
3. `src/services/userImageService.ts` - Image storage and retrieval service

## Features Implemented

1. **Authentication**
   - Email/Password sign up and login
   - Google authentication
   - Password reset functionality
   - Authentication state persistence

2. **Image Storage**
   - Upload user-generated images
   - Retrieve user's image gallery
   - Secure access control based on user ID

3. **Database**
   - Store image metadata in Firestore
   - Query images by user ID
   - Timestamps for image creation

## Testing Firebase Implementation

1. **Authentication Testing**
   - Try registering a new user
   - Test login with email/password
   - Test Google sign-in
   - Verify password reset flow

2. **Storage Testing**
   - Generate and save an image
   - Verify image appears in user's gallery
   - Check image persistence after logout/login

3. **Security Testing**
   - Verify users can only access their own images
   - Ensure unauthenticated users cannot access protected routes
   - Test storage and database rules

## Troubleshooting

Common issues and solutions:

1. **Authentication Errors**
   - Verify Firebase config values
   - Check if authentication methods are enabled
   - Ensure domain is authorized

2. **Storage Errors**
   - Verify storage rules
   - Check file size limits
   - Ensure proper file paths

3. **Database Errors**
   - Verify Firestore rules
   - Check database indexes
   - Validate data structure

## Best Practices

1. Always handle authentication state changes
2. Implement proper error handling
3. Use security rules to protect data
4. Keep Firebase config values secure
5. Implement proper data validation
6. Use batch operations for multiple updates
7. Monitor Firebase usage and quotas

