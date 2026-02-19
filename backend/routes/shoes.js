const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Shoe = require('../models/Shoe');
const ShoeType = require('../models/ShoeType');
const Brand = require('../models/Brand');
const NewArrival = require('../models/NewArrival');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/shoes
// @desc    Get all shoes with filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      brand,
      shoeType,
      size,
      color,
      material,
      lowStock,
      search,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (brand) query.brand = brand;
    if (shoeType) query.shoeType = shoeType;
    if (size) query.size = size;
    if (color) query.color = { $regex: color, $options: 'i' };
    if (material) query.material = material;
    if (lowStock === 'true') query.isLowStock = true;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const shoes = await Shoe.find(query)
      .populate('brand', 'name')
      .populate('shoeType', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Shoe.countDocuments(query);

    res.json({
      success: true,
      count: shoes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: shoes
    });
  } catch (error) {
    console.error('Get shoes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/shoes/low-stock
// @desc    Get low stock items
// @access  Private
router.get('/low-stock', protect, async (req, res) => {
  try {
    const shoes = await Shoe.find({ isLowStock: true, isActive: true })
      .populate('brand', 'name')
      .populate('shoeType', 'name')
      .sort({ quantity: 1 });

    res.json({
      success: true,
      count: shoes.length,
      data: shoes
    });
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/shoes/:id
// @desc    Get single shoe
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id)
      .populate('brand', 'name')
      .populate('shoeType', 'name')
      .populate('createdBy', 'name');

    if (!shoe) {
      return res.status(404).json({
        success: false,
        message: 'Shoe not found'
      });
    }

    res.json({
      success: true,
      data: shoe
    });
  } catch (error) {
    console.error('Get shoe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/shoes
// @desc    Create new shoe
// @access  Private/Owner
router.post('/', [
  protect,
  authorize('owner'),
  upload.array('images', 5)
], async (req, res) => {
  try {
    const {
      name, brand, shoeType, sku, size, color, material,
      quantity, mrp, sellingPrice, description, lowStockThreshold
    } = req.body;

    // Check if SKU already exists
    const existingSku = await Shoe.findOne({ sku });
    if (existingSku) {
      return res.status(400).json({
        success: false,
        message: 'SKU already exists'
      });
    }

    // Get uploaded file paths
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const shoe = await Shoe.create({
      name,
      brand,
      shoeType,
      sku,
      size,
      color,
      material,
      quantity: parseInt(quantity),
      mrp: parseFloat(mrp),
      sellingPrice: parseFloat(sellingPrice),
      description,
      lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : 5,
      images,
      createdBy: req.user._id
    });

    const populatedShoe = await Shoe.findById(shoe._id)
      .populate('brand', 'name')
      .populate('shoeType', 'name');

    res.status(201).json({
      success: true,
      data: populatedShoe
    });
  } catch (error) {
    console.error('Create shoe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/shoes/:id
// @desc    Update shoe
// @access  Private/Owner
router.put('/:id', [
  protect,
  authorize('owner'),
  upload.array('images', 5)
], async (req, res) => {
  try {
    let shoe = await Shoe.findById(req.params.id);

    if (!shoe) {
      return res.status(404).json({
        success: false,
        message: 'Shoe not found'
      });
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      req.body.images = [...(shoe.images || []), ...newImages];
    }

    shoe = await Shoe.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('brand', 'name').populate('shoeType', 'name');

    res.json({
      success: true,
      data: shoe
    });
  } catch (error) {
    console.error('Update shoe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PATCH /api/shoes/:id/quantity
// @desc    Update shoe quantity (for stock adjustments)
// @access  Private/Owner
router.patch('/:id/quantity', [
  protect,
  authorize('owner')
], async (req, res) => {
  try {
    const { quantity, operation } = req.body;

    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) {
      return res.status(404).json({
        success: false,
        message: 'Shoe not found'
      });
    }

    if (operation === 'add') {
      shoe.quantity += parseInt(quantity);
    } else if (operation === 'subtract') {
      shoe.quantity -= parseInt(quantity);
      if (shoe.quantity < 0) shoe.quantity = 0;
    } else {
      shoe.quantity = parseInt(quantity);
    }

    await shoe.save();

    res.json({
      success: true,
      data: shoe
    });
  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/shoes/:id
// @desc    Delete shoe (soft delete)
// @access  Private/Owner
router.delete('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);

    if (!shoe) {
      return res.status(404).json({
        success: false,
        message: 'Shoe not found'
      });
    }

    shoe.isActive = false;
    await shoe.save();

    res.json({
      success: true,
      message: 'Shoe deleted successfully'
    });
  } catch (error) {
    console.error('Delete shoe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ===== SHOE TYPES ROUTES =====

// @route   GET /api/shoes/types/all
// @desc    Get all shoe types
// @access  Private
router.get('/types/all', protect, async (req, res) => {
  try {
    const { brand } = req.query;
    const query = { isActive: true };
    
    if (brand) query.brand = brand;

    const shoeTypes = await ShoeType.find(query)
      .populate('brand', 'name')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: shoeTypes.length,
      data: shoeTypes
    });
  } catch (error) {
    console.error('Get shoe types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/shoes/types
// @desc    Create new shoe type
// @access  Private/Owner
router.post('/types', [
  protect,
  authorize('owner')
], async (req, res) => {
  try {
    const { name, brand, description } = req.body;

    // Check if shoe type exists for this brand
    const existing = await ShoeType.findOne({ name, brand });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Shoe type already exists for this brand'
      });
    }

    const shoeType = await ShoeType.create({
      name,
      brand,
      description,
      createdBy: req.user._id
    });

    const populated = await ShoeType.findById(shoeType._id).populate('brand', 'name');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    console.error('Create shoe type error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ===== NEW ARRIVALS ROUTES =====

// @route   GET /api/shoes/arrivals/all
// @desc    Get all new arrivals
// @access  Private
router.get('/arrivals/all', protect, async (req, res) => {
  try {
    const arrivals = await NewArrival.find({ status: { $in: ['pending', 'arrived'] } })
      .populate('brand', 'name')
      .populate('shoeType', 'name')
      .sort({ expectedDate: 1 });

    res.json({
      success: true,
      count: arrivals.length,
      data: arrivals
    });
  } catch (error) {
    console.error('Get arrivals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/shoes/arrivals
// @desc    Create new arrival entry
// @access  Private/Owner
router.post('/arrivals', [
  protect,
  authorize('owner'),
  upload.array('images', 5)
], async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const arrival = await NewArrival.create({
      ...req.body,
      images,
      createdBy: req.user._id
    });

    const populated = await NewArrival.findById(arrival._id)
      .populate('brand', 'name')
      .populate('shoeType', 'name');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    console.error('Create arrival error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/shoes/arrivals/:id/convert
// @desc    Convert new arrival to active shoe
// @access  Private/Owner
router.post('/arrivals/:id/convert', protect, authorize('owner'), async (req, res) => {
  try {
    const arrival = await NewArrival.findById(req.params.id);

    if (!arrival) {
      return res.status(404).json({
        success: false,
        message: 'New arrival not found'
      });
    }

    if (arrival.convertedToShoe) {
      return res.status(400).json({
        success: false,
        message: 'This arrival has already been converted'
      });
    }

    // Generate SKU
    const sku = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    // Create shoe from arrival
    const shoe = await Shoe.create({
      name: arrival.name,
      brand: arrival.brand,
      shoeType: arrival.shoeType,
      sku,
      size: arrival.size,
      color: arrival.color,
      material: arrival.material,
      quantity: arrival.expectedQuantity,
      mrp: arrival.mrp,
      sellingPrice: arrival.sellingPrice,
      images: arrival.images,
      description: arrival.description,
      createdBy: req.user._id
    });

    // Update arrival status
    arrival.status = 'arrived';
    arrival.arrivedDate = new Date();
    arrival.convertedToShoe = true;
    arrival.shoeId = shoe._id;
    await arrival.save();

    res.json({
      success: true,
      message: 'New arrival converted to active inventory',
      data: { arrival, shoe }
    });
  } catch (error) {
    console.error('Convert arrival error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
