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

// static method to get average of course rating
ReviewSchema.statics.getAverageRating = async function (campId) {
  const obj = await this.aggregate([
    {
      $match: { camp: campId },
    },
    {
      $group: {
        _id: '$camp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  try {
    await this.model('Camp').findByIdAndUpdate(campId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.camp);
});

// Call getAverageCost before remove
ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.camp);
});

module.exports = mongoose.model('Review', ReviewSchema);
