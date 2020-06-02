const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Review needs to have title'],
    maxlength: 150,
  },
  text: {
    type: String,
    required: [true, 'Please add some details'],
  },
  rating: {
    type: Number,
    required: [true, 'Review needs to have rating'],
    min: 1,
    max: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  camp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Camp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Prevent from adding more than one review per camp
ReviewSchema.index({ camp: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
