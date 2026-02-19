const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Shoe = require('../models/Shoe');
const Brand = require('../models/Brand');
const Customer = require('../models/Customer');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/reports/sales
// @desc    Get sales report
// @access  Private/Owner
router.get('/sales', protect, authorize('owner'), async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate) : new Date();

    // Sales by period
    let groupFormat;
    switch (groupBy) {
      case 'month':
        groupFormat = '%Y-%m';
        break;
      case 'week':
        groupFormat = '%Y-W%U';
        break;
      default:
        groupFormat = '%Y-%m-%d';
    }

    const salesReport = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          totalDiscount: { $sum: '$discount' },
          totalTax: { $sum: '$tax' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Payment method breakdown
    const paymentBreakdown = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$total' }
        }
      }
    ]);

    // Top selling items
    const topItems = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.shoeName',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 10 }
    ]);

    // Summary
    const summary = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          totalDiscount: { $sum: '$discount' },
          totalTax: { $sum: '$tax' },
          averageSale: { $avg: '$total' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        period: { start, end },
        summary: summary[0] || {},
        salesByPeriod: salesReport,
        paymentBreakdown,
        topItems
      }
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/reports/inventory
// @desc    Get inventory report
// @access  Private/Owner
router.get('/inventory', protect, authorize('owner'), async (req, res) => {
  try {
    // Total inventory value
    const inventoryValue = await Shoe.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalValue: {
            $sum: { $multiply: ['$quantity', '$sellingPrice'] }
          },
          totalMRPValue: {
            $sum: { $multiply: ['$quantity', '$mrp'] }
          }
        }
      }
    ]);

    // By brand
    const byBrand = await Shoe.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$brand',
          items: { $sum: 1 },
          quantity: { $sum: '$quantity' },
          value: { $sum: { $multiply: ['$quantity', '$sellingPrice'] } }
        }
      },
      {
        $lookup: {
          from: 'brands',
          localField: '_id',
          foreignField: '_id',
          as: 'brandInfo'
        }
      },
      { $unwind: '$brandInfo' },
      {
        $project: {
          brandName: '$brandInfo.name',
          items: 1,
          quantity: 1,
          value: 1
        }
      },
      { $sort: { value: -1 } }
    ]);

    // Low stock items
    const lowStock = await Shoe.find({ isLowStock: true, isActive: true })
      .populate('brand', 'name')
      .populate('shoeType', 'name')
      .select('name sku quantity lowStockThreshold size color')
      .sort({ quantity: 1 });

    // Out of stock
    const outOfStock = await Shoe.countDocuments({ quantity: 0, isActive: true });

    res.json({
      success: true,
      data: {
        summary: inventoryValue[0] || {},
        byBrand,
        lowStock,
        outOfStockCount: outOfStock
      }
    });
  } catch (error) {
    console.error('Inventory report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/reports/customers
// @desc    Get customer report
// @access  Private/Owner
router.get('/customers', protect, authorize('owner'), async (req, res) => {
  try {
    // Total customers
    const totalCustomers = await Customer.countDocuments({ isActive: true });

    // Top customers by spending
    const topCustomers = await Customer.find({ isActive: true })
      .sort({ totalSpent: -1 })
      .limit(10)
      .select('name phone email totalPurchases totalSpent loyaltyPoints lastPurchaseDate');

    // Customer acquisition trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const acquisitionTrend = await Customer.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          isActive: true
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Customer purchase frequency
    const purchaseFrequency = await Customer.aggregate([
      { $match: { isActive: true } },
      {
        $bucket: {
          groupBy: '$totalPurchases',
          boundaries: [0, 1, 3, 5, 10, 20],
          default: '20+',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        topCustomers,
        acquisitionTrend,
        purchaseFrequency
      }
    });
  } catch (error) {
    console.error('Customer report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/reports/performance
// @desc    Get performance metrics
// @access  Private/Owner
router.get('/performance', protect, authorize('owner'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate) : new Date();

    // Sales by staff member
    const staffPerformance = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$soldBy',
          soldByName: { $first: '$soldByName' },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageSale: { $avg: '$total' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Brand performance
    const brandPerformance = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'shoes',
          localField: 'items.shoe',
          foreignField: '_id',
          as: 'shoeInfo'
        }
      },
      { $unwind: '$shoeInfo' },
      {
        $lookup: {
          from: 'brands',
          localField: 'shoeInfo.brand',
          foreignField: '_id',
          as: 'brandInfo'
        }
      },
      { $unwind: '$brandInfo' },
      {
        $group: {
          _id: '$brandInfo._id',
          brandName: { $first: '$brandInfo.name' },
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        period: { start, end },
        staffPerformance,
        brandPerformance
      }
    });
  } catch (error) {
    console.error('Performance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
