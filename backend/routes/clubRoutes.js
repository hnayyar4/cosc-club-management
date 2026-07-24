const express = require('express');
const { createClub, getClubs } = require('../controllers/clubController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.post('/', protect, admin, createClub);
router.get('/', protect, getClubs);

module.exports = router;
