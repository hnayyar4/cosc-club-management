const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['admin', 'club_manager', 'member'];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        message: 'Invalid role. Must be admin, club_manager, or member',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user role error:', error.message);
    res.status(500).json({ message: 'Server error updating user role' });
  }
};

module.exports = { getUsers, updateUserRole };
