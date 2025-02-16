const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A package must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A package name must have less or equal then 40 characters'],
    minlength: [3, 'A package name must have more or equal then 3 characters']
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A package must have a description']
  },
  origin: {
    type: String,
    required: [true, 'A package must have an origin country']
  },
  destination: {
    type: String,
    required: [true, 'A package must have a destination in Nepal']
  },
  price: {
    type: Number,
    required: [true, 'A package must have a price']
  },
  duration: {
    type: Number,
    required: [true, 'A package must have a duration in days']
  },
  includes: {
    type: [String],
    required: [true, 'A package must have at least one included item']
  },
  difficulty: {
    type: String,
    enum: {
      values: ['easy', 'moderate', 'challenging', 'difficult'],
      message: 'Difficulty must be: easy, moderate, challenging, or difficult'
    },
    required: [true, 'A package must have a difficulty level']
  },
  imageBase64: {
    type: String,
    validate: {
      validator: function(val) {
        // Basic validation for base64 image string
        if (!val) return true; // Allow empty
        return val.startsWith('data:image');
      },
      message: 'Image must be a valid base64 encoded image string'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// PRE UPDATE HOOK: Update the updatedAt field
packageSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// INDEX for faster queries
packageSchema.index({ price: 1, isActive: 1 });
packageSchema.index({ difficulty: 1 });
packageSchema.index({ origin: 1, destination: 1 });

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;