const express = require('express');
const { createTurf, getTurfs } = require('../controllers/turfController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin creates turf (protected)
router.post('/', protect, createTurf);

// Users view turfs
router.get('/', getTurfs);

module.exports = router;
