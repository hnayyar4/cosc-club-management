const Club = require('../models/Club');

const createClub = async (req, res) => {
  try {
    const { name, description, foundingDate } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Club name is required' });
    }

    const existingClub = await Club.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existingClub) {
      return res.status(400).json({ message: 'A club with this name already exists' });
    }

    const club = await Club.create({
      name: name.trim(),
      description: description || '',
      foundingDate: foundingDate || null,
      createdBy: req.user._id,
    });

    const populatedClub = await Club.findById(club._id).populate('createdBy', 'name email');

    res.status(201).json(populatedClub);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A club with this name already exists' });
    }
    console.error('Create club error:', error.message);
    res.status(500).json({ message: 'Server error creating club' });
  }
};

const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({})
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(clubs);
  } catch (error) {
    console.error('Get clubs error:', error.message);
    res.status(500).json({ message: 'Server error fetching clubs' });
  }
};

module.exports = { createClub, getClubs };
