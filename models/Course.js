const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
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

// static method to get average of course tuituins
CourseSchema.statics.getAverageCost = async function (campId) {
  const obj = await this.aggregate([
    {
      $match: { camp: campId },
    },
    {
      $group: {
        _id: '$camp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);
  try {
    await this.model('Camp').findByIdAndUpdate(campId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.camp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.camp);
});

module.exports = mongoose.model('Course', CourseSchema);
