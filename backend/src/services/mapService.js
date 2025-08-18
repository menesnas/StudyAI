const axios = require('axios');
const config = require('../config/nominatim.config');

class MapService {
    async searchStudyPlaces(lat, lon, radius, type) {
        return this._makeRequest('/search', {
            q: type,
            lat,
            lon,
            radius,
            limit: 20
        });
    }

    async searchByQuery(query) {
        return this._makeRequest('/search', {
            q: query,
            addressdetails: 1,
            polygon_geojson: 0
        });
    }

    async getPlaceDetails(placeId) {
        return this._makeRequest('/details', {
            place_id: placeId
        });
    }

    async _makeRequest(endpoint, params) {
        try {
            const response = await axios.get(`${config.BASE_URL}${endpoint}`, {
                params: {
                    format: 'json',
                    ...params
                },
                headers: {
                    'User-Agent': config.USER_AGENT
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Nominatim API request failed: ${error.message}`);
        }
    }
}

module.exports = new MapService();