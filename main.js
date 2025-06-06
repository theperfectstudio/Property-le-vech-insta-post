import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';
import { postToInstagram } from './postToInstagram.js';
import { generateCaption } from './captionGenerator.js';

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_JSON);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function main() {
  const snapshot = await db.collection('properties').get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.postedToInstagram === true) {
      continue;
    }

    const imageUrls = data.imageUrls || (data.imageUrl ? [data.imageUrl] : []);
    if (!imageUrls.length) continue;

    const caption = generateCaption(data);
    const success = await postToInstagram(imageUrls, caption);

    if (success) {
      await db.collection('properties').doc(doc.id).update({ postedToInstagram: true });
      console.log(`✅ Posted to Instagram: ${doc.id}`);
    } else {
      console.log(`❌ Failed to post: ${doc.id}`);
    }
  }
}

main();
