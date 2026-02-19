const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Shoe = require('../models/Shoe');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');

// @route   POST /api/sales
// @desc    Create new sale (checkout)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      customer,
      customerName,
      customerPhone,
      items,
      subtotal,
      discount,
      discountPercentage,
      tax,
      taxPercentage,
      total,
      paymentMethod,
      paymentDetails,
      notes
    } = req.body;

    // Validate items and stock
    for (const item of items) {
      const shoe = await Shoe.findById(item.shoe);
      
      if (!shoe) {
        return res.status(404).json({
          success: false,
          message: `Shoe with ID ${item.shoe} not found`
        });
      }

      if (shoe.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${shoe.name}. Available: ${shoe.quantity}, Requested: ${item.quantity}`
        });
      }
    }

    // Create sale
    const sale = await Sale.create({
      customer,
      customerName,
      customerPhone,
      items: items.map(item => ({
        shoe: item.shoe,
        shoeName: item.shoeName,
        sku: item.sku,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      })),
      subtotal,
      discount,
      discountPercentage,
      tax,
      taxPercentage,
      total,
      paymentMethod,
      paymentDetails,
      notes,
      soldBy: req.user._id,
      soldByName: req.user.name
    });

    // Update inventory
    for (const item of items) {
      await Shoe.findByIdAndUpdate(item.shoe, {
        $inc: { quantity: -item.quantity }
      });
    }

    // Update customer stats if customer exists
    if (customer) {
      await Customer.findByIdAndUpdate(customer, {
        $inc: {
          totalPurchases: 1,
          totalSpent: total,
          loyaltyPoints: Math.floor(total / 100) // 1 point per 100 spent
        },
        lastPurchaseDate: new Date()
      });
    }

    const populatedSale = await Sale.findById(sale._id)
      .populate('customer', 'name phone email')
      .populate('soldBy', 'name')
      .populate('items.shoe', 'name brand shoeType');

    res.status(201).json({
      success: true,
      data: populatedSale
    });
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during checkout',
      error: error.message
    });
  }
});

// @route   GET /api/sales
// @desc    Get all sales
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      customer,
      status,
      page = 1,
      limit = 50
    } = req.query;

    const query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (customer) query.customer = customer;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sales = await Sale.find(query)
      .populate('customer', 'name phone')
      .populate('soldBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Sale.countDocuments(query);

    res.json({
      success: true,
      count: sales.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: sales
    });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/sales/:id
// @desc    Get single sale
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('customer', 'name phone email address')
      .populate('soldBy', 'name email')
      .populate({
        path: 'items.shoe',
        populate: [
          { path: 'brand', select: 'name' },
          { path: 'shoeType', select: 'name' }
        ]
      });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    console.error('Get sale error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/sales/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats/dashboard', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today's sales
    const todaySales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ]);

    // This month's sales
    const monthSales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonth },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Low stock count
    const lowStockCount = await Shoe.countDocuments({ isLowStock: true, isActive: true });

    // Top selling shoes (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topSelling = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: 'completed'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.shoe',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' },
          shoeName: { $first: '$items.shoeName' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    // Recent sales for chart
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const dailySales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        today: {
          revenue: todaySales[0]?.total || 0,
          sales: todaySales[0]?.count || 0
        },
        month: {
          revenue: monthSales[0]?.total || 0,
          sales: monthSales[0]?.count || 0
        },
        lowStockCount,
        topSelling,
        dailySales
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
