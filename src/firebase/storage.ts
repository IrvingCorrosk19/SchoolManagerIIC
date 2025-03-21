import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  UploadResult
} from "firebase/storage";
import { storage } from "./config";

// Upload a file to Firebase Storage
export const uploadFile = async (
  path: string, 
  file: File
): Promise<{ url: string; path: string }> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    
    return {
      url,
      path
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Get the download URL for a file
export const getFileUrl = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw error;
  }
};

// Delete a file from Firebase Storage
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};