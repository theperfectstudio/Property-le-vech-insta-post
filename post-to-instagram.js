const axios = require('axios');
const { OpenAI } = require('openai');

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ✅ Setup OpenAI
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Example Firestore property object
const property = {
  propertyType: 'જમીન',
  district: 'Jamnagar',
  taluka: 'Kalavad',
  village: 'Bamathiya',
  area: '3',
  pricePerUnit: '600000',
  finalPrice: '1800000',
};

async function generateCaption(property) {
  const prompt = `Write a short, attractive Instagram caption in English to promote a property listing. Include emoji and the following:
- Property type: ${property.propertyType}
- Village: ${property.village}
- District: ${property.district}
- Area: ${property.area} Bigha
- Price per Bigha: ₹${property.pricePerUnit}
- Total Price: ₹${property.finalPrice}
Add a call to action to contact or DM.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return completion.choices[0].message.content.trim();
}

async function postToInstagram(property) {
  try {
    const caption = await generateCaption(property);

    const mediaRes = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
      {
        image_url: "https://example.com/sample.jpg", // Replace with property.imageUrl
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
