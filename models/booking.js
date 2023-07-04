const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const booking = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  place: { type: Schema.Types.ObjectId, ref: 'ApprovedPlace' },
  startDate: {
    type: String,
    required: true
  },
  lastDate: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Booking', booking);