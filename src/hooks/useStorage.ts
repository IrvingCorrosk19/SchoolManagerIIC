import { useState } from 'react';
import { uploadFile, getFileUrl, deleteFile } from '../firebase';

export function useStorage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  // Upload a file to Firebase Storage
  const upload = async (path: string, file: File) => {
    setUploading(true);
    setProgress(0);
    
    try {
      const result = await uploadFile(path, file);
      setUrl(result.url);
      setError(null);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error uploading file:', err);
      throw err;
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  // Get the download URL for a file
  const getUrl = async (path: string) => {
    try {
      const fileUrl = await getFileUrl(path);
      setUrl(fileUrl);
      setError(null);
      return fileUrl;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error getting file URL:', err);
      throw err;
    }
  };

  // Delete a file from Firebase Storage
  const remove = async (path: string) => {
    try {
      await deleteFile(path);
      setUrl(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error deleting file:', err);
      throw err;
    }
  };

  return {
    uploading,
    progress,
    error,
    url,
    upload,
    getUrl,
    remove
  };
}