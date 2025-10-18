const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  variant: {
    size: String,
    volume: String,
    price: Number,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: Number,
  addons: [
    {
      name: String,
      price: Number,
    },
  ],
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: false, // Will be generated in pre-save hook
      unique: true,
      sparse: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'picked_up',
        'on_the_way',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    pricing: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      deliveryFee: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    deliveryAddress: {
      label: String,
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zipCode: { type: String, required: true },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
      instructions: String,
    },
    payment: {
      method: {
        type: String,
        enum: ['card', 'cash', 'cod', 'wallet'],
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
      },
      transactionId: String,
      paidAt: Date,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rider',
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    coupon: {
      code: String,
      discount: Number,
    },
    notes: String,
    cancellationReason: String,
    rating: {
      score: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      timestamp: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `QJ${Date.now()}-${String(count + 1).padStart(5, '0')}`;
    
    // Add initial status to history
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

// Update status history when status changes
orderSchema.pre('save', function (next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

// Indexes
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ rider: 1 });
orderSchema.index({ 'deliveryAddress.coordinates': '2dsphere' });

module.exports = mongoose.model('Order', orderSchema);
