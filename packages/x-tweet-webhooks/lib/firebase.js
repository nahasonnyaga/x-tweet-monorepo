import admin from 'firebase-admin';
import { handleNewPost } from './hooks.js';
import fs from 'fs';

// Load service account from file if env not set
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

db.collection('posts').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(async change => {
    if (change.type === 'added') {
      await handleNewPost({ id: change.doc.id, ...change.doc.data() });
    }
  });
});

console.log('Firebase listener running...');

