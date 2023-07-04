const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const approvedPlace = Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    required: true,
  },
  roomOne: {
    name: String,
    description: String,
    images: [{ data: String, contentType: String }],
    price: String,
    capacity: String,
  },

  roomTwo: {
    name: String,
    description: String,
    images: [{ data: String, contentType: String }],
    price: String,
    capacity: String,
  },
  roomThree: {
    name: String,
    description: String,
    images: [{ data: String, contentType: String }],
    price: String,
    capacity: String,
  },
  description: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  totalCapacity: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("ApprovedPlace", approvedPlace);
