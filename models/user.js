const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  listing: [{ type: Schema.Types.ObjectId, ref: 'ApprovedPlace' }],
  favourites: [{ type: Schema.Types.ObjectId, ref: 'ApprovedPlace' }],
});

module.exports = mongoose.model("User", userSchema);
