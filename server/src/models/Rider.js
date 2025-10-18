const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ['bicycle', 'scooter', 'motorcycle', 'car'],
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['offline', 'available', 'busy'],
      default: 'offline',
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    activeOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    stats: {
      totalDeliveries: {
        type: Number,
        default: 0,
      },
      completedDeliveries: {
        type: Number,
        default: 0,
      },
      cancelledDeliveries: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalEarnings: {
        type: Number,
        default: 0,
      },
    },
    availability: {
      monday: { start: String, end: String, available: Boolean },
      tuesday: { start: String, end: String, available: Boolean },
      wednesday: { start: String, end: String, available: Boolean },
      thursday: { start: String, end: String, available: Boolean },
      friday: { start: String, end: String, available: Boolean },
      saturday: { start: String, end: String, available: Boolean },
      sunday: { start: String, end: String, available: Boolean },
    },
    documents: [
      {
        type: String,
        url: String,
        verified: { type: Boolean, default: false },
        verifiedAt: Date,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for location-based queries
riderSchema.index({ 'currentLocation.coordinates': '2dsphere' });
riderSchema.index({ status: 1 });
riderSchema.index({ isActive: 1, isVerified: 1 });

// Update location timestamp
riderSchema.methods.updateLocation = function (coordinates) {
  this.currentLocation.coordinates = coordinates;
  this.currentLocation.lastUpdated = new Date();
  return this.save();
};

// Calculate completion rate
riderSchema.virtual('completionRate').get(function () {
  if (this.stats.totalDeliveries === 0) return 0;
  return (this.stats.completedDeliveries / this.stats.totalDeliveries) * 100;
});

module.exports = mongoose.model('Rider', riderSchema);
