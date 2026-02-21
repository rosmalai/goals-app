const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['1year', '5year', '10year', '20year', 'aspiration'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
