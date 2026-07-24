const express = require('express');
const { getUsers, updateUserRole } = require('../controllers/userController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;
