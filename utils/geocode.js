// utils/geocode.js

async function getCoordinates(cityName) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cityName)}&key=${process.env.OPENCAGE_API_KEY}&limit=1`;

  try {
    const response = await fetch(url); // ✅ Native fetch works here
    const data = await response.json();

    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat, lng };
    } else {
      throw new Error('No results found');
    }
  } catch (err) {
    console.error('Geocoding error:', err.message);
    return null;
  }
}

module.exports = getCoordinates;