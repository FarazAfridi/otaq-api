const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unAprrovedPlace = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    required: true
  },
  persons: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('UnApprovedPlace', unAprrovedPlace);