const Turf = require('../models/Turf');

// ADMIN: Add turf
exports.createTurf = async (req, res) => {
  try {
    const turf = await Turf.create(req.body);
    res.status(201).json(turf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: Get all turfs
exports.getTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
