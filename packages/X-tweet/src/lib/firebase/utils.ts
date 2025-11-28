import { usersCollection } from './collections';
import { getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from './app';

/**
 * Checks if a username is available in Firestore.
 * Returns true if available, false if already taken.
 */
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const q = query(usersCollection, where('username', '==', username));
  const snapshot = await getDocs(q);
  return snapshot.empty;
}

/**
 * Updates the user's theme preference in Firestore.
 * @param userId - the UID of the user
 * @param theme - the theme string (e.g., 'light' or 'dark')
 */
export async function updateUserTheme(userId: string, theme: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { theme });
}
