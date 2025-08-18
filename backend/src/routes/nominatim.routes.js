const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

router.get('/search', mapController.searchLocation);
router.get('/study-places', mapController.getStudyPlaces);
router.get('/places/:placeId', mapController.getPlaceDetails);

module.exports = router;
