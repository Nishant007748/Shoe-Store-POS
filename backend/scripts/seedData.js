require('dotenv').config();
const mongoose = require('mongoose');

// Models
const User = require('../models/User');
const Brand = require('../models/Brand');
const ShoeType = require('../models/ShoeType');
const Shoe = require('../models/Shoe');
const Customer = require('../models/Customer');
const NewArrival = require('../models/NewArrival');
const Sale = require('../models/Sale');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const seedData = async () => {
  try {
    // Clear existing data (optional, but good for starting fresh)
    await Brand.deleteMany({});
    await ShoeType.deleteMany({});
    await Shoe.deleteMany({});
    await Customer.deleteMany({});
    await NewArrival.deleteMany({});
    await Sale.deleteMany({});
    console.log('Cleared existing data.');

    // 0. Get or Create Admin User first to own the items
    let adminUser = await User.findOne({ email: 'owner@shoestore.com' });
    if (!adminUser) {
        adminUser = await User.create({
            name: 'Shoe Store Owner',
            email: 'owner@shoestore.com',
            password: 'Owner@123',
            role: 'owner'
        });
    }

    let staffUser = await User.findOne({ email: 'staff@shoestore.com' });
    if (!staffUser) {
        staffUser = await User.create({
            name: 'Store Staff',
            email: 'staff@shoestore.com',
            password: 'Staff@123',
            role: 'user' // Note: Backend schema uses 'user' for staff
        });
    }

    // 1. Create Brands
    const brandDocs = await Brand.insertMany([
      { name: 'Nike', description: 'Just Do It', isActive: true, createdBy: adminUser._id },
      { name: 'Adidas', description: 'Impossible is Nothing', isActive: true, createdBy: adminUser._id },
      { name: 'Puma', description: 'Forever Faster', isActive: true, createdBy: adminUser._id },
      { name: 'Reebok', description: 'Sport the Unexpected', isActive: true, createdBy: adminUser._id },
      { name: 'Vans', description: 'Off the Wall', isActive: true, createdBy: adminUser._id },
    ]);
    console.log('Brands seeded.');

    // 2. Create Shoe Types
    const shoeTypeDocs = await ShoeType.insertMany([
      { name: 'Running', brand: brandDocs.find(b => b.name === 'Nike')._id, description: 'Shoes for running', isActive: true, createdBy: adminUser._id },
      { name: 'Sneakers', brand: brandDocs.find(b => b.name === 'Adidas')._id, description: 'Casual sneakers', isActive: true, createdBy: adminUser._id },
      { name: 'Formal', brand: brandDocs.find(b => b.name === 'Puma')._id, description: 'Formal dress shoes', isActive: true, createdBy: adminUser._id },
      { name: 'Sports', brand: brandDocs.find(b => b.name === 'Reebok')._id, description: 'General sports shoes', isActive: true, createdBy: adminUser._id },
      { name: 'Boots', brand: brandDocs.find(b => b.name === 'Vans')._id, description: 'Heavy-duty boots', isActive: true, createdBy: adminUser._id },
    ]);
    console.log('Shoe types seeded.');

    // Function to get random ID
    const getRandomId = (array) => array[Math.floor(Math.random() * array.length)]._id;

    // 3. Create Shoes
    const shoeData = [
      {
        name: 'Air Max 270',
        brand: brandDocs.find(b => b.name === 'Nike')._id,
        shoeType: shoeTypeDocs.find(t => t.name === 'Running')._id,
        sku: 'NK-AM270-001',
        size: 'UK 9',
        color: 'Black/White',
        material: 'Mesh',
        quantity: 15,
        mrp: 14000,
        sellingPrice: 12500,
        lowStockThreshold: 5,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8fHwxNjQ1NDYxMTE4&ixlib=rb-1.2.1&q=80&w=400'],
        description: 'Iconic running shoe with large Air unit.'
      },
      {
        name: 'Ultraboost 22',
        brand: brandDocs.find(b => b.name === 'Adidas')._id,
        shoeType: shoeTypeDocs.find(t => t.name === 'Running')._id,
        sku: 'AD-UB22-002',
        size: 'UK 10',
        color: 'Core Black',
        material: 'Textile',
        quantity: 8,
        mrp: 16000,
        sellingPrice: 14000,
        lowStockThreshold: 5,
        images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8M3x8c2hvZXN8ZW58MHx8fHwxNjQ1NDYxMTE4&ixlib=rb-1.2.1&q=80&w=400'],
        description: 'High-performance running shoes.'
      },
      {
        name: 'Classic Suede',
        brand: brandDocs.find(b => b.name === 'Puma')._id,
        shoeType: shoeTypeDocs.find(t => t.name === 'Sneakers')._id,
        sku: 'PU-CS-003',
        size: 'UK 8',
        color: 'Red/White',
        material: 'Suede',
        quantity: 2,
        mrp: 6000,
        sellingPrice: 4500,
        lowStockThreshold: 5,
        images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8NHx8c2hvZXN8ZW58MHx8fHwxNjQ1NDYxMTE4&ixlib=rb-1.2.1&q=80&w=400'],
        description: 'Classic lifestyle sneakers.'
      },
      {
         name: 'Old Skool Pro',
         brand: brandDocs.find(b => b.name === 'Vans')._id,
         shoeType: shoeTypeDocs.find(t => t.name === 'Sneakers')._id,
         sku: 'VN-OS-004',
         size: 'UK 9',
         color: 'Black',
         material: 'Canvas',
         quantity: 20,
         mrp: 5500,
         sellingPrice: 4999,
         lowStockThreshold: 5,
         images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8NXx8c2hvZXN8ZW58MHx8fHwxNjQ1NDYxMTE4&ixlib=rb-1.2.1&q=80&w=400'],
         description: 'Skateboarding classics.'
      },
      {
         name: 'Nano X2',
         brand: brandDocs.find(b => b.name === 'Reebok')._id,
         shoeType: shoeTypeDocs.find(t => t.name === 'Sports')._id,
         sku: 'RB-NX2-005',
         size: 'UK 10',
         color: 'Grey/Blue',
         material: 'Synthetic',
         quantity: 0,
         mrp: 11000,
         sellingPrice: 9500,
         lowStockThreshold: 5,
         images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8Nnx8c2hvZXN8ZW58MHx8fHwxNjQ1NDYxMTE4&ixlib=rb-1.2.1&q=80&w=400'],
         description: 'Versatile training shoes.'
      }
    ];
    
    // Add isLowStock calculation based on pre-save logic simulation
    const shoeDocs = await Shoe.insertMany(shoeData.map(s => ({
        ...s,
        isLowStock: s.quantity <= s.lowStockThreshold && s.quantity > 0,
        createdBy: adminUser._id
    })));
    console.log('Shoes seeded.');

    // 4. Create Customers
    const customerDocs = await Customer.insertMany([
      { name: 'John Doe', age: 30, gender: 'Male', phone: '9876543210', requirements: 'Looking for running shoes', transactionStatus: 'Purchased', notes: 'First time buyer' },
      { name: 'Jane Smith', age: 25, gender: 'Female', phone: '9876543211', requirements: 'Casual sneakers', transactionStatus: 'Not Purchased', reason: 'Price too high', notes: 'Will check next week' },
      { name: 'Mike Johnson', age: 40, gender: 'Male', phone: '9876543212', requirements: 'Formal shoes for office', transactionStatus: 'Purchased', notes: 'Regular customer' },
      { name: 'Emily Davis', age: 22, gender: 'Female', phone: '9876543213', requirements: 'Gym shoes', transactionStatus: 'Purchased' },
      { name: 'Chris Wilson', age: 35, gender: 'Male', phone: '9876543214', requirements: 'Boots', transactionStatus: 'Not Purchased', reason: 'Size unavailable' },
    ]);
    console.log('Customers seeded.');

    // 5. Create New Arrivals
    await NewArrival.insertMany([
      {
        name: 'Air Force 1 Shadow',
        brand: brandDocs.find(b => b.name === 'Nike')._id,
        shoeType: shoeTypeDocs.find(t => t.name === 'Sneakers')._id,
        size: 'UK 8',
        color: 'Pastel Multi',
        material: 'Leather',
        expectedQuantity: 20,
        mrp: 10000,
        sellingPrice: 9500,
        expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        status: 'pending',
        images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8c2hvZXN8ZW58MHx8fHwxNjQ1NDYxMTE4&ixlib=rb-1.2.1&q=80&w=400']
      },
      {
        name: 'Yeezy Boost 350',
        brand: brandDocs.find(b => b.name === 'Adidas')._id,
        shoeType: shoeTypeDocs.find(t => t.name === 'Running')._id,
        size: 'UK 9',
        color: 'Zebra',
        material: 'Textile',
        expectedQuantity: 10,
        mrp: 22000,
        sellingPrice: 20000,
        expectedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Next next week
        status: 'pending',
        images: ['https://images.unsplash.com/photo-1552346154-21d32810baa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8MTB8fHNob2VzfGVufDB8fHx8MTY0NTQ2MTExOA&ixlib=rb-1.2.1&q=80&w=400']
      }
    ]);
    console.log('New Arrivals seeded.');

    // 6. Create Sales (To populate Reports)
    // Using the adminUser we created at the top

    const saleItems1 = [
        {
            shoe: shoeDocs[0]._id,
            shoeName: shoeDocs[0].name,
            sku: shoeDocs[0].sku,
            size: shoeDocs[0].size,
            color: shoeDocs[0].color,
            quantity: 2,
            unitPrice: shoeDocs[0].sellingPrice,
            subtotal: shoeDocs[0].sellingPrice * 2
        }
    ];

    const saleItems2 = [
        {
            shoe: shoeDocs[1]._id,
            shoeName: shoeDocs[1].name,
            sku: shoeDocs[1].sku,
            size: shoeDocs[1].size,
            color: shoeDocs[1].color,
            quantity: 1,
            unitPrice: shoeDocs[1].sellingPrice,
            subtotal: shoeDocs[1].sellingPrice * 1
        },
        {
            shoe: shoeDocs[2]._id,
            shoeName: shoeDocs[2].name,
            sku: shoeDocs[2].sku,
            size: shoeDocs[2].size,
            color: shoeDocs[2].color,
            quantity: 1,
            unitPrice: shoeDocs[2].sellingPrice,
            subtotal: shoeDocs[2].sellingPrice * 1
        }
    ];

    await Sale.insertMany([
        {
            invoiceNumber: `INV-20231010-0001`,
            customer: customerDocs[0]._id,
            customerName: customerDocs[0].name,
            customerPhone: customerDocs[0].phone,
            items: saleItems1,
            subtotal: saleItems1.reduce((sum, i) => sum + i.subtotal, 0),
            total: saleItems1.reduce((sum, i) => sum + i.subtotal, 0),
            paymentMethod: 'Cash',
            soldBy: adminUser._id,
            soldByName: adminUser.name,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
            invoiceNumber: `INV-20231012-0002`,
            customer: customerDocs[2]._id,
            customerName: customerDocs[2].name,
            customerPhone: customerDocs[2].phone,
            items: saleItems2,
            subtotal: saleItems2.reduce((sum, i) => sum + i.subtotal, 0),
            total: saleItems2.reduce((sum, i) => sum + i.subtotal, 0),
            paymentMethod: 'Card',
            soldBy: adminUser._id,
            soldByName: adminUser.name,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        }
    ]);
    console.log('Sales seeded.');

    console.log('Dummy data insertion complete!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
