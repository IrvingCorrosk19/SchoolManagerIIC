import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  DocumentData,
  QuerySnapshot,
  DocumentReference,
  DocumentSnapshot
} from "firebase/firestore";
import { db } from "./config";

// Generic function to add a document to a collection
export const addDocument = async <T extends DocumentData>(
  collectionName: string, 
  data: T, 
  id?: string
): Promise<DocumentReference<DocumentData>> => {
  try {
    if (id) {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, data);
      return docRef;
    } else {
      const collectionRef = collection(db, collectionName);
      const docRef = doc(collectionRef);
      await setDoc(docRef, data);
      return docRef;
    }
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

// Generic function to get a document by ID
export const getDocument = async <T extends DocumentData>(
  collectionName: string, 
  id: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

// Generic function to get all documents from a collection
export const getDocuments = async <T extends DocumentData>(
  collectionName: string
): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

// Generic function to update a document
export const updateDocument = async <T extends Partial<DocumentData>>(
  collectionName: string, 
  id: string, 
  data: T
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

// Generic function to delete a document
export const deleteDocument = async (
  collectionName: string, 
  id: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

// Generic function to query documents
export const queryDocuments = async <T extends DocumentData>(
  collectionName: string,
  fieldPath: string,
  operator: "==" | "!=" | ">" | ">=" | "<" | "<=",
  value: any
): Promise<T[]> => {
  try {
    const q = query(collection(db, collectionName), where(fieldPath, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

// Generic function for more complex queries
export const complexQuery = async <T extends DocumentData>(
  collectionName: string,
  conditions: { field: string; operator: "==" | "!=" | ">" | ">=" | "<" | "<="; value: any }[],
  orderByField?: string,
  orderDirection?: "asc" | "desc",
  limitCount?: number
): Promise<T[]> => {
  try {
    let q = collection(db, collectionName);
    
    // Add where conditions
    let queryWithConditions = query(q);
    conditions.forEach(condition => {
      queryWithConditions = query(
        queryWithConditions, 
        where(condition.field, condition.operator, condition.value)
      );
    });
    
    // Add orderBy if specified
    if (orderByField) {
      queryWithConditions = query(
        queryWithConditions, 
        orderBy(orderByField, orderDirection || "asc")
      );
    }
    
    // Add limit if specified
    if (limitCount) {
      queryWithConditions = query(queryWithConditions, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(queryWithConditions);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error(`Error with complex query on ${collectionName}:`, error);
    throw error;
  }
};