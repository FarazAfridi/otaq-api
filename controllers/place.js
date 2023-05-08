const UnApprovedPlace = require("../models/unAprrovedPlace");
const ApprovedPlace = require("../models/approvedPlace");
const Booking = require("../models/booking");
const User = require("../models/user");

exports.add = async (req, res) => {
  let images = []
  for (let i=0; i<req.files.length; i++) {
    images.push(req.files[i].filename)
  }
  const {name, description, price} = req.body;

  const unApprovedPlace = await new UnApprovedPlace({ name, images, description, price });
  const response = await unApprovedPlace.save()

  res.json(response);

};

exports.unApprovedList = async (req, res) => {
  const unApprovedPlace = await UnApprovedPlace.find({})
  res.json(unApprovedPlace)
}

exports.AddToApprovedList = async (req, res) => {
  const id = req.body.id;
  const {name, description, images, price} = await UnApprovedPlace.findById(id)
  const approvedPlace = await new ApprovedPlace({ name, images, description, price });
  const removeUnapprovedPlace = await UnApprovedPlace.findByIdAndDelete(id)
  await approvedPlace.save()
  res.json(removeUnapprovedPlace)
}

exports.removeUnApprovedPlace = async (req, res) => {
  const id = req.body.id;
  const removePlace = await UnApprovedPlace.findByIdAndDelete(id)
  res.json(removePlace)
}

exports.approvedList = async (req, res) => {
  const approvedPlace = await ApprovedPlace.find({})
  console.log(req.email)
  res.json(approvedPlace)
}

exports.getSinglePlace = async (req, res) => {
  const id = req.params.id;
  const place = await ApprovedPlace.findById(id)
  res.json(place)
}

exports.bookPlace = async (req, res) => {
  const booking = await new Booking({user: req.user.userId, place: req.body.placeId, startDate: req.body.startDate, lastDate: req.body.lastDate})
  await booking.save()
  res.json("place booked")
}

exports.getBookedPlaces = async (req, res) => {
  const booking = await Booking.find({}).populate('place user')
  res.json(booking)
}

exports.removeApprovedPlace = async (req, res) => {
  const id = req.body.id;
  const removePlace = await ApprovedPlace.findByIdAndDelete(id)
  res.json(removePlace)
}

exports.getCount = async (req, res) => {
  const ordersCount = await Booking.count()
  const placesCount = await ApprovedPlace.count()
  const unapprovedPlacesCount = await UnApprovedPlace.count()
  const usersCount = await User.count()
  res.json({orders: ordersCount, places: placesCount, unapprovedPlaces: unapprovedPlacesCount, users: usersCount})
}