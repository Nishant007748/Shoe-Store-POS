const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Brand = require('../models/Brand');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/brands
// @desc    Get all brands
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true })
      .sort({ name: 1 })
      .populate('createdBy', 'name');
    
    res.json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/brands/:id
// @desc    Get single brand
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).populate('createdBy', 'name');
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    console.error('Get brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/brands
// @desc    Create new brand
// @access  Private/Owner
router.post('/', [
  protect,
  authorize('owner'),
  body('name').trim().notEmpty().withMessage('Brand name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, logo } = req.body;

    // Check if brand already exists
    const existingBrand = await Brand.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: 'Brand already exists'
      });
    }

    const brand = await Brand.create({
      name,
      description,
      logo,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: brand
    });
  } catch (error) {
    console.error('Create brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/brands/:id
// @desc    Update brand
// @access  Private/Owner
router.put('/:id', [
  protect,
  authorize('owner')
], async (req, res) => {
  try {
    let brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    console.error('Update brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/brands/:id
// @desc    Delete brand (soft delete)
// @access  Private/Owner
router.delete('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Soft delete
    brand.isActive = false;
    await brand.save();

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
