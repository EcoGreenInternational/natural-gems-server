
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Gem = require('./models/Gem');

const MONGO_URI = process.env.MONGO_URI ;



async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');


  await Gem.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared existing data');


  const admin = await User.create({
    name: 'John Doe',
    email: 'admin@naturalgems.com',
    password: 'admin123',
    role: 'admin'
  });
  console.log('Admin created:', admin.email);
  console.log('Admin password: admin123');

  
  const gems = await Gem.insertMany(sampleGems);
  console.log(`Created ${gems.length} sample gems`);

  mongoose.disconnect();
  console.log('\n✓ Seeding complete!');
  console.log('Login: admin@naturalgems.com / admin123');
}

seed().catch(console.error);
