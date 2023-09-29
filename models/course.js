const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    support: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'presell', 'published'],
      default: 'draft',
    },
    discount: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      default: 5,
    },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

schema.virtual('sessions', {
  ref: 'Session',
  localField: '_id',
  foreignField: 'course',
});

schema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'course',
});

const model = mongoose.model('Course', schema);

module.exports = model;
