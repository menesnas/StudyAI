const mapService = require('../services/mapService');

class MapController {
    /**
     * Yakındaki çalışma mekanlarını listeler
     */
    async getStudyPlaces(req, res) {
        try {
            const { lat, lon, radius = 1000, type = 'library' } = req.query;

            if (!lat || !lon) {
                return res.status(400).json({ 
                    error: 'Latitude and longitude are required' 
                });
            }

            const places = await mapService.searchStudyPlaces(
                parseFloat(lat),
                parseFloat(lon),
                parseInt(radius),
                type
            );

            res.json(places);
        } catch (error) {
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    /**
     * Mekan detaylarını getirir
     */
    async getPlaceDetails(req, res) {
        try {
            const { placeId } = req.params;
            
            if (!placeId) {
                return res.status(400).json({ 
                    error: 'Place ID is required' 
                });
            }

            const details = await mapService.getPlaceDetails(placeId);
            res.json(details);
        } catch (error) {
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    /**
     * Lokasyon araması yapar
     */
    async searchLocation(req, res) {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({ error: 'Query parameter is required' });
            }
            const results = await mapService.searchByQuery(q);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new MapController();