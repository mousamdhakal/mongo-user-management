const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Auth = require('./models/Auth');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Sample data
const users = [
  {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
    address1: '123 Main St',
    address2: 'Apt 4B',
    city: 'New York',
    postalCode: '10001',
    country: 'USA',
    phoneNumber: '212-555-1234',
    email: 'john.doe@example.com',
    notes: 'Regular customer'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: new Date('1985-05-15'),
    address1: '456 Park Ave',
    address2: '',
    city: 'Boston',
    postalCode: '02108',
    country: 'USA',
    phoneNumber: '617-555-6789',
    email: 'jane.smith@example.com',
    notes: 'Premium subscriber'
  }
];

// Admin account
const admin = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password:  process.env.ADMIN_PASSWORD || 'admin123',
};

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Auth.deleteMany();
    
    // Import sample users
    await User.insertMany(users);
    
    // Create admin account
    await Auth.create(admin);
    
    console.log('Data imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Auth.deleteMany();
    
    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command arguments
// If we pass -i, import data
// If we pass -d, delete data
// If we pass anything else, show usage
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please add proper flag: -i to import, -d to delete');
  process.exit();
}