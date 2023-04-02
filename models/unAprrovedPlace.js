const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unAprrovedPlace = Schema({
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
  }
})

module.exports = mongoose.model('UnApprovedPlace', unAprrovedPlace);