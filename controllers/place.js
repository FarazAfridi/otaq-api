const UnApprovedPlace = require("../models/unAprrovedPlace");
const ApprovedPlace = require("../models/approvedPlace");
const Booking = require("../models/booking");
const User = require("../models/user");
require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const approvedPlace = require("../models/approvedPlace");

const mail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

exports.add = async (req, res) => {
  const { name, description, price, roomType, persons, city } = req.body;

  let images = [];
  for (let i = 0; i < req.files.length; i++) {
    const buffer = fs.readFileSync(req.files[i].path, { encoding: "base64" });
    images.push({ contentType: req.files[i].mimetype, data: buffer });
  }

  const unApprovedPlace = await new UnApprovedPlace({
    user: req.user.userId,
    name,
    images,
    description,
    price,
    roomType: roomType ? roomType : "Normal",
    city,
    persons,
  });
  await unApprovedPlace.save();

  res.json(unApprovedPlace);
};

exports.unApprovedList = async (req, res) => {
  const unapprovedPlaces = await UnApprovedPlace.find({});
  console.log(unapprovedPlaces);
  res.json(unapprovedPlaces);
};

exports.AddToApprovedList = async (req, res) => {
  const id = req.body.id;

  if (id) {
    const unapprovedPlace = await UnApprovedPlace.findById(id).populate("user");

    const approvedPlace = await new ApprovedPlace({
      user: unapprovedPlace.user._id,
      name: unapprovedPlace.name,
      images: unapprovedPlace.images,
      description: unapprovedPlace.description,
      price: unapprovedPlace.price,
      roomType: unapprovedPlace.roomType,
      persons: unapprovedPlace.persons,
      city: unapprovedPlace.city,
    });
    const userDoc = await User.findById(unapprovedPlace.user._id);
    userDoc.listing.push(approvedPlace._id);
    userDoc.save();
    const removeUnapprovedPlace = await UnApprovedPlace.findByIdAndDelete(id);
    await approvedPlace.save();
    res.json(removeUnapprovedPlace);
  } else {
    const {
      name,
      room1Name,
      room1Description,
      room1Price,
      room1Capacity,
      description,
      city,
      room2Name,
      room2Description,
      room2Price,
      room2Capacity,
      room3Name,
      room3Description,
      room3Price,
      room3Capacity,
    } = req.body;

    let room1 = [];
    let room2 = [];
    let room3 = [];

    req.files.room1.forEach((item) => {
      const buffer = fs.readFileSync(item.path, { encoding: "base64" });
      room1.push({ contentType: item.mimetype, data: buffer });
    });

    req.files.room2.forEach((item) => {
      const buffer = fs.readFileSync(item.path, { encoding: "base64" });
      room2.push({ contentType: item.mimetype, data: buffer });
    });

    req.files.room3.forEach((item) => {
      const buffer = fs.readFileSync(item.path, { encoding: "base64" });
      room3.push({ contentType: item.mimetype, data: buffer });
    });

    const approvedPlace = await new ApprovedPlace({
      user: req.user.userId,
      name: name,
      description: description,
      city: city,
      totalCapacity:
        Number(room1Capacity) + Number(room2Capacity) + Number(room3Capacity),
      roomOne: {
        name: room1Name,
        description: room1Description,
        price: room1Price,
        images: room1,
        capacity: room1Capacity,
      },

      roomTwo: {
        name: room2Name,
        description: room2Description,
        price: room2Price,
        images: room2,
        capacity: room2Capacity,
      },

      roomThree: {
        name: room3Name,
        description: room3Description,
        price: room3Price,
        images: room3,
        capacity: room3Capacity,
      },
    });
    await approvedPlace.save();

    const userDoc = await User.findById(req.user.userId);
    userDoc.listing.push(approvedPlace._id);
    await userDoc.save();

    res.json(approvedPlace);
  }
};

exports.removeUnApprovedPlace = async (req, res) => {
  const id = req.body.id;
  const removePlace = await UnApprovedPlace.findByIdAndDelete(id);
  res.json(removePlace);
};

exports.approvedList = async (req, res) => {
  const city = req.query.city;
  let upperCasedFirstLetter;
  if (city) {
    upperCasedFirstLetter = city.charAt(0).toUpperCase() + city.slice(1);
  }
  const roomType = req.query.roomtype;
  const persons = req.query.persons;
  let places;

  if (roomType && city && persons) {
    places = await ApprovedPlace.find({
      $and: [{ roomType }, { city: upperCasedFirstLetter }, { persons }],
    });
  } else if (city) {
    places = await ApprovedPlace.find({ city: upperCasedFirstLetter });
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
exports.approveOrder = async (req, res) => {

  if (!req.body.id) res.json("no id is found");
  const fullData = await Booking.findById(req.body.id).populate("place user");
  fullData.status = "Approved";
  await fullData.save()

  const placeToUpdateBooking = await ApprovedPlace.findById(
    fullData.place._id
  );
  placeToUpdateBooking.bookings.push(fullData._id);
  await placeToUpdateBooking.save();
  console.log(placeToUpdateBooking)

  let date1 = new Date(fullData.startDate);
  date1.setMinutes(date1.getMinutes() - date1.getTimezoneOffset());

  let date2 = new Date(fullData.lastDate);
  date2.setMinutes(date2.getMinutes() - date2.getTimezoneOffset());

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const days = (date2 - date1) / millisecondsPerDay;

  const roomRent = [
    fullData.place.roomOne,
    fullData.place.roomTwo,
    fullData.place.roomThree,
  ].filter((room) => room.name === fullData.roomType)[0].price;

  const mailOptions = {
    from: process.env.USER,
    to: "farazkhan9453@gmail.com",
    subject: "Order Placed",
    text: `Order id: ${fullData._id} \nPlace name: ${
      fullData.place.name
    }\nRoom Type: ${fullData.roomType}\nDays Booked: ${days} \nFrom: ${
      fullData.startDate
    } \nTo: ${fullData.lastDate} \nTotal: ${roomRent * days}Rs`,
  };

  mail.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent " + info.response);
    }
  });

  const mailOptions2 = {
    from: process.env.USER,
    to: fullData.user.email,
    subject: "Order Placed",
    text: `Thank you for placing order \nOrder id: ${
      fullData._id
    } \nPlace name: ${fullData.place.name}\nRoom Type: ${
      fullData.roomType
    }\nDays Booked: ${days} \nFrom: ${fullData.startDate} \nTo: ${
      fullData.lastDate
    } \nTotal: ${roomRent * days}Rs`,
  };

  mail.sendMail(mailOptions2, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent " + info.response);
    }
  });

  res.json("Order has been approved")
};

exports.rejectOrder = async (req, res) => {
  const id = req.body.id;
  if (!id) res.json("no id found");

  const booking = await Booking.findById(id);
  booking.status = "Rejected";
  await booking.save();

  res.json("Order has been rejected")

}

exports.bookPlace = async (req, res) => {
  const booking = await new Booking({
    user: req.user.userId,
    place: req.body.placeId,
    startDate: req.body.startDate,
    lastDate: req.body.lastDate,
    roomType: req.body.room,
    status: "Pending",
  });

  const placeToUpdateBooking = await ApprovedPlace.findById(
    req.body.placeId
  ).populate("bookings");

  let noError = false;
  const date1 = new Date(booking.startDate).getTime();

  if (placeToUpdateBooking.bookings.length > 0) {
    const bookingsByRoomType = placeToUpdateBooking.bookings.filter(
      (book) => booking.roomType === book.roomType
    );

    if (!bookingsByRoomType.length > 0) {
      placeToUpdateBooking.bookings.push(booking._id);
      noError = true;
    } else {
      const result = bookingsByRoomType.every((book) => {
        const date2 = new Date(book.lastDate).getTime();
        const result = date1 > date2;
        return result;
      });
      if (result) {
        placeToUpdateBooking.bookings.push(booking._id);
        noError = true;
      }
    }
  } else {
    noError = true;
  }

  if (noError) {
    await booking.save();

    res.json("Place booked");
  } else {
    res.json("Sorry! The room is already booked");
  }
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
    (booking) => booking.user !== null && booking.user._id.toString() === userId
  );
  res.json(userBooking);
};

exports.getUserListing = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.find({ _id: userId }).populate("listing");
  res.json(user);
};
