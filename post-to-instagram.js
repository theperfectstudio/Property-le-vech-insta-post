const admin = require("firebase-admin");
const axios = require("axios");
const serviceAccount = require("./service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;

async function postToInstagram() {
  const snapshot = await db.collection("properties")
    .where("postedToInstagram", "==", false)
    .limit(1)
    .get();

  if (snapshot.empty) {
    console.log("✅ No new property to post.");
    return;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();

  const mediaRes = await axios.post(
    `https://graph.facebook.com/v18.0/${IG_USER_ID}/media`,
    null,
    {
      params: {
        image_url: data.imageUrl,
        caption: data.caption,
        access_token: ACCESS_TOKEN
      }
    }
  );

  const creationId = mediaRes.data.id;

  await axios.post(
    `https://graph.facebook.com/v18.0/${IG_USER_ID}/media_publish`,
    null,
    {
      params: {
        creation_id: creationId,
        access_token: ACCESS_TOKEN
      }
    }
  );

  await db.collection("properties").doc(doc.id).update({
    postedToInstagram: true,
    postedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log("✅ Posted to Instagram:", data.caption);
}

postToInstagram();
    {
      params: {
        creation_id: creationId,
        access_token: ACCESS_TOKEN
      }
    }
  );

  await db.collection("properties").doc(doc.id).update({
    postedToInstagram: true,
    postedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log("✅ Posted to Instagram:", data.caption);
}

postToInstagram();
