const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Voucher = require('./models/Voucher');
const User = require('./models/User');
const bcrypt = require('bcrypt');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Clear existing data
    await Category.deleteMany({});
    await Voucher.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data.');

    // 2. Create Categories
    // Note: Names are chosen to match the icon logic in Home.jsx
    const categories = await Category.insertMany([
      { name: 'Food & Drinks', description: 'Delicious deals on your favorite meals and beverages.' },
      { name: 'Tech & Gadgets', description: 'The latest electronics and innovative gadgets at a discount.' },
      { name: 'Travel & Stay', description: 'Explore the world with exclusive travel and accommodation offers.' },
      { name: 'Fashion & Style', description: 'Stay trendy with the best deals on apparel and accessories.' },
      { name: 'Home & Living', description: 'Everything you need to make your house a home.' }
    ]);
    console.log('Categories seeded.');

    const [food, tech, travel, fashion, home] = categories;

    // 3. Create Vouchers
    const vouchers = [
      {
        code: 'NIKE-JUSTDOIT-20',
        discountAmount: 20,
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days left
        category: fashion._id,
        description: 'Get 20% off on all Nike official store items.'
      },
      {
        code: 'STARBUCKS-COFFEE-10',
        discountAmount: 10,
        expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days left
        category: food._id,
        description: 'Valid for any grande sized beverage at participating stores.'
      },
      {
        code: 'APPLE-BEATS-15',
        discountAmount: 15,
        expiryDate: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours left
        category: tech._id,
        description: 'Exclusive discount for the new Studio Pro lineup.'
      },
      {
        code: 'AIRBNB-WANDER-50',
        discountAmount: 50,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days left
        category: travel._id,
        description: 'Apply to any booking over $200 worldwide.'
      },
      {
        code: 'IKEA-DREAM-HOME',
        discountAmount: 25,
        expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days left
        category: home._id,
        description: 'Savings on furniture and home accessories.'
      },
      {
        code: 'AMAZON-PRIME-25',
        discountAmount: 25,
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        category: food._id, // Placing in food for variety in the UI
        description: 'Redeemable on all Amazon Prime eligible items.'
      },
      {
        code: 'ADIDAS-SUMMER-30',
        discountAmount: 30,
        expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        category: fashion._id,
        description: 'Summer clearance sale discount.'
      },
      {
        code: 'SONY-PSN-20',
        discountAmount: 20,
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        category: tech._id,
        description: 'Add credit to your PlayStation Network wallet.'
      }
    ];

    await Voucher.insertMany(vouchers);
    console.log('Vouchers seeded successfully.');

    // 4. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.insertMany([
      {
        username: 'admin_hub',
        email: 'admin@voucherhub.com',
        password: hashedPassword,
        role: 'admin',
        points: 10000
      },
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        points: 500
      }
    ]);
    console.log('Users seeded successfully.');

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
