const Order = require('../models/Order');
const logger = require('../utils/logger');

/**
 * Clean up old orders
 * This job should run periodically (e.g., daily) to:
 * - Archive old delivered orders
 * - Cancel abandoned pending orders
 * - Clean up temporary data
 */
const cleanupOrders = async () => {
  try {
    logger.info('Starting order cleanup job...');

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Cancel pending orders older than 24 hours
    const cancelledOrders = await Order.updateMany(
      {
        status: 'pending',
        createdAt: { $lt: oneDayAgo },
      },
      {
        $set: {
          status: 'cancelled',
          cancellationReason: 'Automatically cancelled - no payment received',
        },
      }
    );

    logger.info(`Cancelled ${cancelledOrders.modifiedCount} abandoned orders`);

    // Archive old delivered orders (30+ days)
    // TODO: Move to archive collection or mark as archived
    const oldDeliveredOrders = await Order.find({
      status: 'delivered',
      createdAt: { $lt: thirtyDaysAgo },
    });

    logger.info(`Found ${oldDeliveredOrders.length} old delivered orders for archiving`);

    // TODO: Implement archiving logic
    // - Move to separate archive collection
    // - Or mark with isArchived flag
    // - Or export to cold storage

    logger.info('Order cleanup job completed');
    return {
      success: true,
      cancelledCount: cancelledOrders.modifiedCount,
      archivedCount: oldDeliveredOrders.length,
    };
  } catch (error) {
    logger.error('Order cleanup job error:', error);
    throw error;
  }
};

/**
 * Update stale orders
 * Find orders stuck in certain statuses and handle them
 */
const updateStaleOrders = async () => {
  try {
    logger.info('Checking for stale orders...');

    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // Find orders stuck in "preparing" status for more than 2 hours
    const staleOrders = await Order.find({
      status: { $in: ['preparing', 'ready', 'picked_up', 'on_the_way'] },
      updatedAt: { $lt: twoHoursAgo },
    });

    logger.info(`Found ${staleOrders.length} stale orders`);

    // TODO: Implement logic to handle stale orders
    // - Notify admin
    // - Auto-escalate
    // - Send alerts

    for (const order of staleOrders) {
      logger.warn(`Stale order detected: ${order.orderNumber} - Status: ${order.status}`);
      // TODO: Send notification to admin
    }

    return {
      success: true,
      staleOrderCount: staleOrders.length,
    };
  } catch (error) {
    logger.error('Stale orders check error:', error);
    throw error;
  }
};

// Export functions
module.exports = {
  cleanupOrders,
  updateStaleOrders,
};

// If running as standalone script
if (require.main === module) {
  // Connect to database
  require('dotenv').config();
  const { connectDatabase } = require('../config/database');
  
  connectDatabase().then(async () => {
    await cleanupOrders();
    await updateStaleOrders();
    process.exit(0);
  });
}
