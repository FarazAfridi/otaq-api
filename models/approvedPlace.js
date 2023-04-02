<<<<<<< HEAD
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const approvedPlace = Schema({
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

=======
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const approvedPlace = Schema({
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

>>>>>>> 46bedab (api deploy)
module.exports = mongoose.model('ApprovedPlace', approvedPlace);