import { useState, useEffect } from 'react';
import { 
  addDocument, 
  getDocument, 
  getDocuments, 
  updateDocument, 
  deleteDocument, 
  queryDocuments 
} from '../firebase';
import { DocumentData } from 'firebase/firestore';

// Generic hook for Firestore operations
export function useFirestore<T extends DocumentData>(collectionName: string) {
  const [documents, setDocuments] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all documents from a collection
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const result = await getDocuments<T>(collectionName);
      setDocuments(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error(`Error fetching documents from ${collectionName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single document by ID
  const fetchDocument = async (id: string) => {
    setLoading(true);
    try {
      const result = await getDocument<T>(collectionName, id);
      setError(null);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error(`Error fetching document from ${collectionName}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a new document
  const addDoc = async (data: T, id?: string) => {
    setLoading(true);
    try {
      const docRef = await addDocument<T>(collectionName, data, id);
      setError(null);
      // Refresh the documents list
      fetchDocuments();
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error(`Error adding document to ${collectionName}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing document
  const updateDoc = async (id: string, data: Partial<T>) => {
    setLoading(true);
    try {
      await updateDocument<Partial<T>>(collectionName, id, data);
      setError(null);
      // Refresh the documents list
      fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error(`Error updating document in ${collectionName}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const deleteDoc = async (id: string) => {
    setLoading(true);
    try {
      await deleteDocument(collectionName, id);
      setError(null);
      // Refresh the documents list
      fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error(`Error deleting document from ${collectionName}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Query documents
  const queryDocs = async (
    fieldPath: string,
    operator: "==" | "!=" | ">" | ">=" | "<" | "<=",
    value: any
  ) => {
    setLoading(true);
    try {
      const result = await queryDocuments<T>(collectionName, fieldPath, operator, value);
      setError(null);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error(`Error querying documents from ${collectionName}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [collectionName]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    fetchDocument,
    addDoc,
    updateDoc,
    deleteDoc,
    queryDocs
  };
}