require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Brand = require('../models/Brand');
const ShoeType = require('../models/ShoeType');
const Shoe = require('../models/Shoe');
const Customer = require('../models/Customer');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Brand.deleteMany({});
    await ShoeType.deleteMany({});
    await Shoe.deleteMany({});
    await Customer.deleteMany({});

    // Create Users
    console.log('👥 Creating users...');
    const owner = await User.create({
      name: 'Store Owner',
      email: 'owner@shoestore.com',
      password: 'Owner@123',
      role: 'owner',
      phone: '+91-9876543210'
    });

    const staff = await User.create({
      name: 'Sales Staff',
      email: 'staff@shoestore.com',
      password: 'Staff@123',
      role: 'user',
      phone: '+91-9876543211'
    });

    // Create Brands
    console.log('🏷️  Creating brands...');
    const brands = await Brand.insertMany([
      { name: 'Nike', description: 'Just Do It', createdBy: owner._id },
      { name: 'Adidas', description: 'Impossible is Nothing', createdBy: owner._id },
      { name: 'Puma', description: 'Forever Faster', createdBy: owner._id },
      { name: 'Reebok', description: 'Be More Human', createdBy: owner._id },
      { name: 'New Balance', description: 'Endorsed by No One', createdBy: owner._id }
    ]);

    // Create Shoe Types
    console.log('👟 Creating shoe types...');
    const shoeTypes = [];
    const types = ['Sports Shoes', 'Running Shoes', 'Casual Sneakers', 'Formal Shoes', 'Sandals'];
    
    for (const brand of brands) {
      for (const type of types) {
        shoeTypes.push({
          name: type,
          brand: brand._id,
          description: `${brand.name} ${type}`,
          createdBy: owner._id
        });
      }
    }
    
    const createdTypes = await ShoeType.insertMany(shoeTypes);

    // Create Shoes
    console.log('👞 Creating shoes...');
    const shoes = [];
    const colors = ['Black', 'White', 'Red', 'Blue', 'Grey', 'Navy', 'Green'];
    const sizes = ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
    const materials = ['Leather', 'Synthetic', 'Canvas', 'Mesh'];

    let skuCounter = 1000;

    for (let i = 0; i < brands.length; i++) {
      const brand = brands[i];
      const brandTypes = createdTypes.filter(t => t.brand.toString() === brand._id.toString());
      
      for (let j = 0; j < 4; j++) {
        const type = brandTypes[Math.floor(Math.random() * brandTypes.length)];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const quantity = Math.floor(Math.random() * 50) + 1;
        const mrp = Math.floor(Math.random() * 5000) + 2000;
        const sellingPrice = Math.floor(mrp * 0.85);

        shoes.push({
          name: `${brand.name} ${type.name} ${color}`,
          brand: brand._id,
          shoeType: type._id,
          sku: `SKU${skuCounter++}`,
          size,
          color,
          material,
          quantity,
          mrp,
          sellingPrice,
          description: `Premium ${brand.name} ${type.name} in ${color}. Made with quality ${material}.`,
          lowStockThreshold: 5,
          createdBy: owner._id
        });
      }
    }

    await Shoe.insertMany(shoes);

    // Create Sample Customers
    console.log('🧑 Creating customers...');
    const customers = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91-9876543220',
        address: {
          street: '123 MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        },
        loyaltyPoints: 150,
        totalPurchases: 3,
        totalSpent: 15000,
        createdBy: owner._id
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91-9876543221',
        address: {
          street: '456 Park Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400002'
        },
        loyaltyPoints: 200,
        totalPurchases: 5,
        totalSpent: 20000,
        createdBy: owner._id
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        phone: '+91-9876543222',
        address: {
          street: '789 Link Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400003'
        },
        loyaltyPoints: 50,
        totalPurchases: 1,
        totalSpent: 5000,
        createdBy: owner._id
      }
    ];

    await Customer.insertMany(customers);

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Owner Account:');
    console.log('  Email: owner@shoestore.com');
    console.log('  Password: Owner@123');
    console.log('\nSales Staff Account:');
    console.log('  Email: staff@shoestore.com');
    console.log('  Password: Staff@123');
    console.log('\n🎉 Seed data created:');
    console.log(`  - ${brands.length} brands`);
    console.log(`  - ${createdTypes.length} shoe types`);
    console.log(`  - ${shoes.length} shoes`);
    console.log(`  - ${customers.length} customers`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
