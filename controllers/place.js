const UnApprovedPlace = require("../models/unAprrovedPlace");
const ApprovedPlace = require("../models/approvedPlace");
const Booking = require("../models/booking");
const User = require("../models/user");
require("dotenv").config();
const nodemailer = require("nodemailer");

const mail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

exports.add = async (req, res) => {
  let images = [];
  for (let i = 0; i < req.files.length; i++) {
    images.push(req.files[i].filename);
  }
  const { name, description, price, roomType } = req.body;

  console.log(req.user.userId);
  const unApprovedPlace = await new UnApprovedPlace({
    user: req.user.userId,
    name,
    images,
    description,
    price,
    roomType: roomType ? roomType : 'Normal'
  });
  const response = await unApprovedPlace.save();

  res.json(response);
};

exports.unApprovedList = async (req, res) => {
  const unApprovedPlace = await UnApprovedPlace.find({});
  res.json(unApprovedPlace);
};

exports.AddToApprovedList = async (req, res) => {
  const id = req.body.id;
  const unapprovedPlace =
    await UnApprovedPlace.findById(id).populate("user");
  console.log(unapprovedPlace)
  console.log(unapprovedPlace.roomType)
  const approvedPlace = await new ApprovedPlace({
    user: unapprovedPlace.user._id,
    name: unapprovedPlace.name,
    images: unapprovedPlace.images,
    description: unapprovedPlace.description,
    price: unapprovedPlace.price,
    roomType: unapprovedPlace.roomType
  });
  const userDoc = await User.findById(unapprovedPlace.user._id);
  userDoc.listing.push(approvedPlace._id);
  userDoc.save();
  const removeUnapprovedPlace = await UnApprovedPlace.findByIdAndDelete(id);
  await approvedPlace.save();
  res.json(removeUnapprovedPlace);
};

exports.removeUnApprovedPlace = async (req, res) => {
  const id = req.body.id;
  const removePlace = await UnApprovedPlace.findByIdAndDelete(id);
  res.json(removePlace);
};

exports.approvedList = async (req, res) => {
  const price = req.query.price;
  const roomType = req.query.roomtype;
  let places;

  if (price && roomType) {
    places = await ApprovedPlace.find({ roomType: roomType, price: price });
  } else if (roomType) {
    places = await ApprovedPlace.find({ roomType: roomType });
  } else if (price) {
    places = await ApprovedPlace.find({ price: price });
  } else {
    places = await ApprovedPlace.find({});
  }

  res.json(places);
};

exports.getSinglePlace = async (req, res) => {
  const id = req.params.id;
  const place = await ApprovedPlace.findById(id);
  res.json(place);
};

exports.bookPlace = async (req, res) => {
  const booking = await new Booking({
    user: req.user.userId,
    place: req.body.placeId,
    startDate: req.body.startDate,
    lastDate: req.body.lastDate,
  });
  await booking.save();
  const fullData = await Booking.findById(booking._id).populate("place");
  // const userDoc = await User.findById(req.user.userId);
  //   userDoc.listing.push(req.body.placeId)
  //   userDoc.save()

  const mailOptions = {
    from: process.env.USER,
    to: "farazkhan9453@gmail.com",
    subject: "Order Placed",
    text: `Order id: ${booking._id} \nPlace name: ${fullData.place.name} \nFrom: ${booking.startDate} \nTo: ${booking.lastDate} \nRent: ${fullData.place.price}`,
  };

  mail.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent " + info.response);
    }
  });

  res.json("place booked");
};

exports.getBookedPlaces = async (req, res) => {
  const booking = await Booking.find({}).populate("place user");
  res.json(booking);
};

exports.removeApprovedPlace = async (req, res) => {
  const id = req.body.id;
  const removePlace = await ApprovedPlace.findByIdAndDelete(id);
  res.json(removePlace);
};

exports.getCount = async (req, res) => {
  const ordersCount = await Booking.count();
  const placesCount = await ApprovedPlace.count();
  const unapprovedPlacesCount = await UnApprovedPlace.count();
  const usersCount = await User.count();
  res.json({
    orders: ordersCount,
    places: placesCount,
    unapprovedPlaces: unapprovedPlacesCount,
    users: usersCount,
  });
};

exports.getUserBookedPlaces = async (req, res) => {
  const userId = req.user.userId;

  const bookings = await Booking.find({}).populate("user place");
  const userBooking = bookings.filter(
    (booking) => booking.user._id.toString() === userId
  );
  res.json(userBooking);
};

exports.getUserListing = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.find({ _id: userId }).populate("listing");
  res.json(user);
};
