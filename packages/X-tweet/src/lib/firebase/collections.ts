import { collection } from "firebase/firestore";
import { db } from "./app";

// Firestore collections
export const usersCollection = collection(db, "users");
export const userStatsCollection = collection(db, "userStats");
export const userBookmarksCollection = collection(db, "userBookmarks");
export const tweetsCollection = collection(db, "tweets");
export const commentsCollection = collection(db, "comments");
export const trendsCollection = collection(db, "trends");
export const notificationsCollection = collection(db, "notifications");
export const paymentsCollection = collection(db, "payments");
export const mediaCollection = collection(db, "media");
export const videosCollection = collection(db, "videos");
export const reactionsCollection = collection(db, "reactions");
export const adminCollection = collection(db, "admin");
