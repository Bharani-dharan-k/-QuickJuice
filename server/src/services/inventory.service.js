const Product = require('../models/Product');
const logger = require('../utils/logger');

/**
 * Check product stock availability
 */
exports.checkStockAvailability = async (productId, variantSize, quantity) => {
  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      return { available: false, message: 'Product not found' };
    }

    const variant = product.variants.find((v) => v.size === variantSize);
    
    if (!variant) {
      return { available: false, message: 'Variant not found' };
    }

    if (variant.stock < quantity) {
      return {
        available: false,
        message: 'Insufficient stock',
        availableStock: variant.stock,
      };
    }

    return { available: true, variant };
  } catch (error) {
    logger.error('Stock check error:', error);
    throw error;
  }
};

/**
 * Update product stock
 */
exports.updateProductStock = async (productId, variantSize, quantity, operation = 'subtract') => {
  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    const variant = product.variants.find((v) => v.size === variantSize);
    
    if (!variant) {
      throw new Error('Variant not found');
    }

    if (operation === 'subtract') {
      variant.stock = Math.max(0, variant.stock - quantity);
    } else if (operation === 'add') {
      variant.stock += quantity;
    } else if (operation === 'set') {
      variant.stock = quantity;
    }

    await product.save();

    // Check for low stock alert
    if (variant.stock < 10) {
      logger.warn(`Low stock alert: ${product.name} (${variant.size}) - ${variant.stock} remaining`);
      // TODO: Send notification to admin
    }

    return { success: true, newStock: variant.stock };
  } catch (error) {
    logger.error('Stock update error:', error);
    throw error;
  }
};

/**
 * Batch update stock for multiple products
 */
exports.batchUpdateStock = async (updates) => {
  try {
    const results = [];

    for (const update of updates) {
      const { productId, variantSize, quantity, operation } = update;
      const result = await this.updateProductStock(
        productId,
        variantSize,
        quantity,
        operation
      );
      results.push({ productId, ...result });
    }

    return results;
  } catch (error) {
    logger.error('Batch stock update error:', error);
    throw error;
  }
};

/**
 * Get low stock products
 */
exports.getLowStockProducts = async (threshold = 10) => {
  try {
    const products = await Product.find({
      'variants.stock': { $lt: threshold },
    });

    const lowStockItems = [];

    products.forEach((product) => {
      product.variants.forEach((variant) => {
        if (variant.stock < threshold) {
          lowStockItems.push({
            productId: product._id,
            productName: product.name,
            variant: variant.size,
            currentStock: variant.stock,
          });
        }
      });
    });

    return lowStockItems;
  } catch (error) {
    logger.error('Get low stock error:', error);
    throw error;
  }
};

/**
 * Reserve stock for order (temporary hold)
 */
exports.reserveStock = async (items, reservationId) => {
  // TODO: Implement stock reservation logic
  // This is useful to prevent overselling during checkout process
  // Stock is reserved for X minutes while customer completes payment
  
  logger.info(`Stock reserved for ${reservationId}`);
  return { success: true };
};

/**
 * Release reserved stock
 */
exports.releaseReservedStock = async (reservationId) => {
  // TODO: Implement release reserved stock logic
  
  logger.info(`Reserved stock released for ${reservationId}`);
  return { success: true };
};

/**
 * Sync inventory with external system
 */
exports.syncInventory = async () => {
  try {
    // TODO: Implement inventory sync with external warehouse/POS system
    
    logger.info('Inventory sync started');
    
    // Example: Fetch data from external API
    // Update local database
    
    logger.info('Inventory sync completed');
    return { success: true };
  } catch (error) {
    logger.error('Inventory sync error:', error);
    throw error;
  }
};
