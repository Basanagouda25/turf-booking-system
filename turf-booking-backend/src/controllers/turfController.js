const Turf = require('../models/Turf');

// ADMIN: Add turf
const createTurf = async (req, res) => {
  try {
    const turf = await Turf.create(req.body);
    res.status(201).json(turf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: Get all turfs
const getTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: Get single turf by ID
const getTurfById = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    res.json(turf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch turf" });
  }
};

module.exports = {
  createTurf,
  getTurfs,
  getTurfById,
};
