require('dotenv').config(); // Optional, only if you're using a .env file
const axios = require('axios');

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;

if (!ACCESS_TOKEN || !IG_USER_ID) {
  console.error("❌ Missing ACCESS_TOKEN or IG_USER_ID in environment variables");
  process.exit(1);
}

// Sample property post (you would replace this logic with your Firestore fetch)
const property = {
  imageUrl: "https://example.com/image.jpg",
  caption: "🌟 New Property for Sale in Jamnagar! ₹5,00,000 per Bigha 🏡📍Contact Now!",
};

// Upload media to Instagram
async function postToInstagram(property) {
  try {
    // Step 1: Create media container
    const mediaResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
      {
        image_url: property.imageUrl,
        caption: property.caption,
        access_token: ACCESS_TOKEN,
      }
    );

    const creationId = mediaResponse.data.id;

    // Step 2: Publish the media
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`,
      {
        creation_id: creationId,
        access_token: ACCESS_TOKEN,
      }
    );

    console.log("✅ Instagram post published:", publishResponse.data);
  } catch (err) {
    console.error("❌ Failed to post on Instagram:", err.response?.data || err.message);
  }
}

postToInstagram(property);
