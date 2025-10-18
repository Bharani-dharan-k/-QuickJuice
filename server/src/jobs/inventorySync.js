const { syncInventory, getLowStockProducts } = require('../services/inventory.service');
const logger = require('../utils/logger');

/**
 * Sync inventory with external systems
 * This job should run periodically to:
 * - Sync stock levels with warehouse
 * - Update prices from external sources
 * - Check for discrepancies
 */
const inventorySyncJob = async () => {
  try {
    logger.info('Starting inventory sync job...');

    // Sync inventory
    await syncInventory();

    // Check for low stock items
    const lowStockItems = await getLowStockProducts(10);

    if (lowStockItems.length > 0) {
      logger.warn(`Low stock alert: ${lowStockItems.length} items below threshold`);
      
      // TODO: Send notification to admin about low stock items
      lowStockItems.forEach((item) => {
        logger.warn(
          `Low stock: ${item.productName} (${item.variant}) - ${item.currentStock} remaining`
        );
      });

      // TODO: Auto-generate purchase orders for low stock items
    }

    logger.info('Inventory sync job completed');
    return {
      success: true,
      lowStockCount: lowStockItems.length,
    };
  } catch (error) {
    logger.error('Inventory sync job error:', error);
    throw error;
  }
};

/**
 * Check for expired products
 * TODO: If implementing product expiration tracking
 */
const checkExpiredProducts = async () => {
  try {
    logger.info('Checking for expired products...');
    
    // TODO: Implement expiration check logic
    // - Find products past expiration date
    // - Mark as unavailable
    // - Notify admin

    return { success: true };
  } catch (error) {
    logger.error('Expired products check error:', error);
    throw error;
  }
};

/**
 * Update product availability based on stock
 */
const updateProductAvailability = async () => {
  try {
    logger.info('Updating product availability...');
    
    const Product = require('../models/Product');

    // Find products where all variants are out of stock
    const products = await Product.find();

    let updatedCount = 0;

    for (const product of products) {
      const totalStock = product.variants.reduce(
        (sum, variant) => sum + variant.stock,
        0
      );

      const shouldBeAvailable = totalStock > 0;

      if (product.isAvailable !== shouldBeAvailable) {
        product.isAvailable = shouldBeAvailable;
        await product.save();
        updatedCount++;
        
        logger.info(
          `Updated availability for ${product.name}: ${shouldBeAvailable ? 'Available' : 'Unavailable'}`
        );
      }
    }

    logger.info(`Updated availability for ${updatedCount} products`);
    return { success: true, updatedCount };
  } catch (error) {
    logger.error('Update availability error:', error);
    throw error;
  }
};

// Export functions
module.exports = {
  inventorySyncJob,
  checkExpiredProducts,
  updateProductAvailability,
};

// If running as standalone script
if (require.main === module) {
  require('dotenv').config();
  const { connectDatabase } = require('../config/database');
  
  connectDatabase().then(async () => {
    await inventorySyncJob();
    await updateProductAvailability();
    process.exit(0);
  });
}
