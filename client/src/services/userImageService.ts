import imageCompression from 'browser-image-compression';

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
      // Convert imageUrl to a Blob
      let blob: Blob;
      if (imageUrl.startsWith('data:')) {
        const response = await fetch(imageUrl);
        blob = await response.blob();
      } else {
        const response = await fetch(imageUrl);
        blob = await response.blob();
      }

      // Compress the image
      const compressedBlob = await imageCompression(blob, {
        maxSizeMB: 1, // Target size in MB
        maxWidthOrHeight: 1920, // Max width or height in pixels
        useWebWorker: true,
      });

      // Create FormData to send the compressed image as a file
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('prompt', prompt);
      formData.append('image', compressedBlob, 'image.jpg');

      // Send the image to your backend API using Fetch with multipart/form-data
      const response = await fetch('http://localhost:5000/api/images/save', {
        method: 'POST',
        body: formData,
        // Note: No need to set 'Content-Type' header; Fetch automatically sets it to 'multipart/form-data' with the correct boundary when using FormData
      });

      if (!response.ok) {
        throw new Error(`Failed to save image: ${response.statusText}`);
      }

      const result = await response.json();
      return result.id; // Return the saved image ID
    } catch (error) {
      console.error("Error saving image:", error);
      throw error;
    }
  },

  getUserImages: async (userId: string): Promise<SavedImage[]> => {
    try {
      // Fetch images from your backend API using Fetch
      const response = await fetch(`http://localhost:5000/api/images/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get user images: ${response.statusText}`);
      }

      const images: SavedImage[] = await response.json();

      // Convert createdAt strings to Date objects
      const parsedImages = images.map((image: SavedImage) => ({
        ...image,
        createdAt: new Date(image.createdAt),
      }));

      // Sort by createdAt in descending order (newest first)
      return parsedImages.sort((a: SavedImage, b: SavedImage) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error("Error getting user images:", error);
      throw error;
    }
  },
};