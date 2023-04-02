const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const booking = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  place: { type: Schema.Types.ObjectId, ref: 'ApprovedPlace' }
})

module.exports = mongoose.model('Booking', booking);