require('dotenv').config();
const axios = require('axios');

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;

// 🔍 Example property data – replace with Firestore data later
const property = {
  propertyType: 'જમીન',
  district: 'Jamnagar',
  taluka: 'Kalavad',
  village: 'Bamathiya',
  area: '3',
  pricePerUnit: '600000',
  finalPrice: '1800000',
  imageUrl: 'https://example.com/sample.jpg', // Replace with real property image
};

// 📝 Custom caption logic (no OpenAI)
function generateSimpleCaption(property) {
  return `📍 Location: ${property.village}, ${property.taluka}, ${property.district}
🏡 Type: ${property.propertyType}
📏 Area: ${property.area} Bigha
💰 ₹${Number(property.pricePerUnit).toLocaleString()} per Bigha
🧮 Total: ₹${Number(property.finalPrice).toLocaleString()}

📞 Contact us for more info or DM now! #PropertyLeVech #GujaratProperty`;
}

async function postToInstagram(property) {
  try {
    const caption = generateSimpleCaption(property);

    const mediaRes = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
      {
        image_url: property.imageUrl,
        caption,
        access_token: ACCESS_TOKEN,
      }
    );

    const publishRes = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`,
      {
        creation_id: mediaRes.data.id,
        access_token: ACCESS_TOKEN,
      }
    );

    console.log("✅ Instagram post published:", publishRes.data);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

postToInstagram(property);
