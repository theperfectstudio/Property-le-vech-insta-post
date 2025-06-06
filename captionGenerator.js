export function generateCaption(data) {
  const type = data.propertyType || 'Property';
  const location = data.location || 'Unknown Area';
  const price = data.price ? `₹${data.price}` : 'Price on request';
  const bhk = data.bhk ? `${data.bhk} BHK` : '';
  const contact = data.contact || '';

  const caption = `🏡 ${type} for Sale ${bhk}
📍 Location: ${location}
💰 Price: ${price}
📞 Contact: ${contact}

#${type.replace(/\s+/g, '')} #${location.replace(/\s+/g, '')} #propertyforsale #realestate #PropertyLeVech`;

  return caption;
}
