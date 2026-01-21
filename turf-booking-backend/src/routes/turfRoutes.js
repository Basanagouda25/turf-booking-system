const express = require('express');
const {
  createTurf,
  getTurfs,
  getTurfById
} = require('../controllers/turfController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin creates turf
router.post('/', protect, createTurf);

// Users view turfs
router.get('/', getTurfs);
router.get('/:id', getTurfById);

module.exports = router;
