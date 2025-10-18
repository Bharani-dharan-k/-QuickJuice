const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variant: {
    size: String,
    volume: String,
    price: Number,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  addons: [
    {
      name: String,
      price: Number,
    },
  ],
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [cartItemSchema],
    coupon: {
      code: String,
      discount: Number,
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for subtotal
cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const addonsTotal = (item.addons || []).reduce((sum, addon) => sum + addon.price, 0);
    return total + itemTotal + addonsTotal * item.quantity;
  }, 0);
});

// Virtual for discount amount
cartSchema.virtual('discountAmount').get(function () {
  if (!this.coupon) return 0;
  
  const subtotal = this.subtotal;
  if (this.coupon.type === 'percentage') {
    return (subtotal * this.coupon.discount) / 100;
  }
  return this.coupon.discount;
});

// Virtual for total
cartSchema.virtual('total').get(function () {
  return Math.max(0, this.subtotal - this.discountAmount);
});

// Virtual for item count
cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((count, item) => count + item.quantity, 0);
});

// Index - user field should be unique
cartSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);
