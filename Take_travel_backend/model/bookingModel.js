const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Package',
    required: [true, 'Booking must belong to a Package']
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User']
  },
  guideId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  startDate: {
    type: Date,
    required: [true, 'Booking must have a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Booking must have an end date']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: [true, 'Booking must have a price']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'packageId',
    select: 'name price duration imageBase64'
  }).populate({
    path: 'userId',
    select: 'name email'
  });
  next();
});

bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;