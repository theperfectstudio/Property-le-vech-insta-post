const axios = require('axios');

// ✅ Secrets provided via GitHub Actions
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;

if (!ACCESS_TOKEN || !IG_USER_ID) {
  console.error("❌ Missing ACCESS_TOKEN or IG_USER_ID in environment variables");
  process.exit(1);
}

// Example property post — replace with your Firestore data
const property = {
  imageUrl: "https://example.com/image.jpg",
  caption: "🏡 New Property in Jamnagar! ₹5,00,000 per Bigha. Contact us now!",
};

async function postToInstagram(property) {
  try {
    // 1. Create Media Container
    const mediaResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
      {
        image_url: property.imageUrl,
        caption: property.caption,
        access_token: ACCESS_TOKEN,
      }
    );

    const creationId = mediaResponse.data.id;

    // 2. Publish Media
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`,
      {
        creation_id: creationId,
        access_token: ACCESS_TOKEN,
      }
    );

    console.log("✅ Post published successfully:", publishResponse.data);
  } catch (err) {
    console.error("❌ Instagram API Error:", err.response?.data || err.message);
  }
}

postToInstagram(property);
