const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');

/**
 * Process payment based on payment method
 * @param {Object} options - Payment options
 * @returns {Object} Payment result
 */
exports.processPayment = async ({ amount, method, details, customerId }) => {
  try {
    switch (method) {
      case 'card':
        return await this.processCardPayment(amount, details, customerId);
      case 'cash':
      case 'cod': // Support both 'cash' and 'cod' for cash on delivery
        return await this.processCashPayment(amount);
      case 'wallet':
        return await this.processWalletPayment(amount, customerId);
      default:
        throw new Error('Invalid payment method');
    }
  } catch (error) {
    logger.error('Payment processing error:', error);
    throw error;
  }
};

/**
 * Process card payment using Stripe
 */
exports.processCardPayment = async (amount, details, customerId) => {
  try {
    if (!details || !details.stripePaymentMethodId) {
      throw new Error('Payment details are required for card payments');
    }

    // Check if it's a mock payment (for testing without Stripe)
    if (details.stripePaymentMethodId.startsWith('pm_mock_')) {
      return {
        success: true,
        transactionId: `CARD-${Date.now()}`,
        status: 'completed',
      };
    }

    // Real Stripe payment processing
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: details.stripePaymentMethodId,
      customer: customerId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        transactionId: paymentIntent.id,
        status: 'completed',
      };
    } else {
      throw new Error('Payment failed');
    }
  } catch (error) {
    logger.error('Stripe payment error:', error);
    throw new Error(`Payment failed: ${error.message}`);
  }
};

/**
 * Process cash payment (COD)
 */
exports.processCashPayment = async (amount) => {
  // Cash on delivery - no processing needed
  return {
    success: true,
    transactionId: `COD-${Date.now()}`,
    status: 'pending',
  };
};

/**
 * Process wallet payment
 */
exports.processWalletPayment = async (amount, customerId) => {
  // TODO: Implement wallet payment logic
  // - Check wallet balance
  // - Deduct amount from wallet
  // - Create transaction record
  
  return {
    success: true,
    transactionId: `WALLET-${Date.now()}`,
    status: 'completed',
  };
};

/**
 * Create Stripe payment intent
 */
exports.createPaymentIntent = async (amount, customerId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    logger.error('Create payment intent error:', error);
    throw error;
  }
};

/**
 * Process refund
 */
exports.processRefund = async (transactionId, amount) => {
  try {
    if (transactionId.startsWith('COD') || transactionId.startsWith('WALLET')) {
      // Handle COD/Wallet refund differently
      return {
        success: true,
        refundId: `REFUND-${Date.now()}`,
        status: 'pending',
      };
    }

    // Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: transactionId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return {
      success: true,
      refundId: refund.id,
      status: refund.status,
    };
  } catch (error) {
    logger.error('Refund error:', error);
    throw error;
  }
};

/**
 * Verify webhook signature
 */
exports.verifyWebhookSignature = (payload, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    logger.error('Webhook signature verification failed:', error);
    throw new Error('Webhook signature verification failed');
  }
};
