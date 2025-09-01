// searchService.js
require('dotenv').config();
const axios = require('axios');

const SERPAPI_KEY = process.env.SERPAPI_KEY;

async function search(query) {
  if (!SERPAPI_KEY) {
    console.error('Lütfen SERPAPI_KEY ortam değişkenini ayarlayın.');
    return [];
  }
  const params = {
    q: query,
    api_key: SERPAPI_KEY,
    engine: 'google',
    num: 5
  };

  try {
    const res = await axios.get('https://serpapi.com/search', { params });
    const data = res.data;

    const results = data.organic_results || data.organic || [];

    const links = results
      .map(r => r.link || r.url)
      .filter(Boolean);

    return [...new Set(links)];
  } catch (err) {
    console.error('Arama başarısız:', err.response?.data || err.message);
    return [];
  }
}

module.exports = { search };
