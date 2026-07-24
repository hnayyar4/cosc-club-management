require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'Admin123!',
    role: 'admin',
  },
  {
    name: 'Club Manager',
    email: 'manager@test.com',
    password: 'Manager123!',
    role: 'club_manager',
  },
  {
    name: 'Member User',
    email: 'member@test.com',
    password: 'Member123!',
    role: 'member',
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    await User.deleteMany({
      email: { $in: seedUsers.map((u) => u.email) },
    });

    for (const userData of seedUsers) {
      await User.create(userData);
      console.log(`Created user: ${userData.email} (${userData.role})`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
