
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

interface SavedImage {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  createdAt: Date;
}

export const userImageService = {
  saveImage: async (userId: string, prompt: string, imageUrl: string): Promise<string> => {
    try {
      // First upload the image to Firebase Storage
      const timestamp = Date.now();
      const storageRef = ref(storage, `user-images/${userId}/${timestamp}.jpg`);
      
      // Convert URL to base64 string if it's not already
      if (imageUrl.startsWith('data:')) {
        // It's already a base64 string, upload directly
        await uploadString(storageRef, imageUrl, 'data_url');
      } else {
        // It's a URL, fetch it and convert to base64 first
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        
        await new Promise<void>((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              if (typeof reader.result === 'string') {
                await uploadString(storageRef, reader.result, 'data_url');
                resolve();
              } else {
                reject(new Error('Failed to convert image to base64'));
              }
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      
      // Get the download URL for the uploaded image
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Save the image metadata to Firestore
      const docRef = await addDoc(collection(db, "userImages"), {
        userId,
        prompt,
        imageUrl: downloadUrl,
        createdAt: new Date()
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error saving image:", error);
      throw error;
    }
  },
  
  getUserImages: async (userId: string): Promise<SavedImage[]> => {
    try {
      const imagesQuery = query(
        collection(db, "userImages"),
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(imagesQuery);
      const images: SavedImage[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        images.push({
          id: doc.id,
          userId: data.userId,
          prompt: data.prompt,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt.toDate()
        });
      });
      
      // Sort by createdAt in descending order (newest first)
      return images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error("Error getting user images:", error);
      throw error;
    }
  }
};
