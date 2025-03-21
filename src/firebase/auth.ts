import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  User,
  UserCredential
} from "firebase/auth";
import { auth } from "./config";

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's profile with the display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Sign out the current user
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Get the current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};