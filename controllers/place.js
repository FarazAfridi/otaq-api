const UnApprovedPlace = require("../models/unAprrovedPlace");
const ApprovedPlace = require("../models/approvedPlace");
const Booking = require("../models/booking");
const User = require("../models/user");
require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const approvedPlace = require("../models/approvedPlace");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

const mail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

exports.add = async (req, res) => {
  req.setTimeout(0);
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

  // let room1 = [];
  // let room2 = [];
  // let room3 = [];

  // req.files.room1.forEach(async (item) => {
  //   const b64 = Buffer.from(item.buffer).toString("base64");
  //   let dataURI = "data:" + item.mimetype + ";base64," + b64;
  //   const cldRes = await handleUpload(dataURI);
  //   room1.push({ contentType: item.mimetype, data: cldRes.url });
  // });

  // req.files.room2.forEach(async (item) => {
  //   const b64 = Buffer.from(item.buffer).toString("base64");
  //   let dataURI = "data:" + item.mimetype + ";base64," + b64;
  //   const cldRes = await handleUpload(dataURI);
  //   room2.push({ contentType: item.mimetype, data: cldRes.url });
  // });

  const room1Images = req.files.room1
  const room2Images = req.files.room2
  const room3Images = req.files.room3

  async function uploadImagesToCloudinary(room) {
    const images = [];

    for (const file of room) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;

      const response = await handleUpload(dataURI)
      console.log(response)
      images.push({ contentType: file.mimetype, data: response.url });
       
    }
    return images
  }

  const room1 = await uploadImagesToCloudinary(room1Images)
  const room2 = await uploadImagesToCloudinary(room2Images)
  const room3 = await uploadImagesToCloudinary(room3Images)
console.log(room1, room2, room3)

  

  /// newwww
  // req.files.room1.forEach(function (item) {
  //   const b64 = Buffer.from(item.buffer).toString("base64");
  //   let dataURI = "data:" + item.mimetype + ";base64," + b64;
  //   handleUpload(dataURI).then((data) => {
  //     room1.push({ contentType: item.mimetype, data: data.url });
  //   }).catch(err => console.log(err))
  // });
  // req.files.room2.forEach(function (item, index) {
  //   const b64 = Buffer.from(item.buffer).toString("base64");
  //   let dataURI = "data:" + item.mimetype + ";base64," + b64;
  //   handleUpload(dataURI).then((data) => {
  //     room2.push({ contentType: item.mimetype, data: data.url });
  //   }).catch(err => console.log(err))
  // });
  // req.files.room3.forEach(function (item, index) {
  //   const b64 = Buffer.from(item.buffer).toString("base64");
  //   let dataURI = "data:" + item.mimetype + ";base64," + b64;
  //   handleUpload(dataURI).then((data) => {
  //     room3.push({ contentType: item.mimetype, data: data.url });
  //   }).catch(err => console.log(err))
  // });
////////////////////////////////



  //     for (var i = 0; i < req.files.room1.length; i++) {

  //       const b64 = Buffer.from(req.files.room1[i].buffer).toString("base64");
  //       let dataURI = "data:" + req.files.room1[i].mimetype + ";base64," + b64;
  //       const cldRes = await handleUpload(dataURI);
  //       room1.push({ contentType: req.files.room1[i].mimetype, data: cldRes.url });
  //     console.log('called 1')

  //   }
  //   for (var i = 0; i < req.files.room2.length; i++) {

  //     const b64 = Buffer.from(req.files.room1[i].buffer).toString("base64");
  //     let dataURI = "data:" + req.files.room1[i].mimetype + ";base64," + b64;
  //     const cldRes = await handleUpload(dataURI);
  //     room2.push({ contentType: req.files.room1[i].mimetype, data: cldRes.url });
  //     console.log('called 2')
  // }
  // for (var i = 0; i < req.files.room3.length; i++) {

  //   const b64 = Buffer.from(req.files.room1[i].buffer).toString("base64");
  //   let dataURI = "data:" + req.files.room1[i].mimetype + ";base64," + b64;
  //   const cldRes = await handleUpload(dataURI);
  //   room2.push({ contentType: req.files.room1[i].mimetype, data: cldRes.url });
  //   console.log('called 3')

  // }

  // req.files.room3.forEach((item) => {
  //   const b64 = Buffer.from(item.buffer).toString("base64");
  //   let dataURI = "data:" + item.mimetype + ";base64," + b64;
  //   const cldRes = await handleUpload(dataURI);
  //   room3.push({ contentType: item.mimetype, data: cldRes.url });
  // });

  // req.files.room1.forEach((item) => {
  //   const buffer = fs.readFileSync(item.path, { encoding: "base64" });
  //   room1.push({ contentType: item.mimetype, data: buffer });
  // });

  // req.files.room2.forEach((item) => {
  //   const buffer = fs.readFileSync(item.path, { encoding: "base64" });
  //   room2.push({ contentType: item.mimetype, data: buffer });
  // });

  // req.files.room3.forEach((item) => {
  //   const buffer = fs.readFileSync(item.path, { encoding: "base64" });
  //   room3.push({ contentType: item.mimetype, data: buffer });
  // });

    const unApprovedPlace = await new UnApprovedPlace({
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
    await unApprovedPlace.save();
    setTimeout(() => {
      res.json(unApprovedPlace);
    }, 2000);

};

exports.unApprovedList = async (req, res) => {
  const unapprovedPlaces = await UnApprovedPlace.find({});
  res.json(unapprovedPlaces);
};

exports.AddToApprovedList = async (req, res) => {
  const id = req.body.id;

  if (id) {
    const unapprovedPlace = await UnApprovedPlace.findById(id).populate("user");

    const approvedPlace = await new ApprovedPlace({
      user: unapprovedPlace.user._id,
      name: unapprovedPlace.name,
      description: unapprovedPlace.description,
      city: unapprovedPlace.city,
      totalCapacity:
        Number(unapprovedPlace.roomOne.capacity) +
        Number(unapprovedPlace.roomTwo.capacity) +
        Number(unapprovedPlace.roomThree.capacity),
      roomOne: {
        name: unapprovedPlace.roomOne.name,
        description: unapprovedPlace.roomOne.description,
        price: unapprovedPlace.roomOne.price,
        images: unapprovedPlace.roomOne.images,
        capacity: unapprovedPlace.roomOne.capacity,
      },

      roomTwo: {
        name: unapprovedPlace.roomTwo.name,
        description: unapprovedPlace.roomTwo.description,
        price: unapprovedPlace.roomTwo.price,
        images: unapprovedPlace.roomTwo.images,
        capacity: unapprovedPlace.roomTwo.capacity,
      },

      roomThree: {
        name: unapprovedPlace.roomThree.name,
        description: unapprovedPlace.roomThree.description,
        price: unapprovedPlace.roomThree.price,
        images: unapprovedPlace.roomThree.images,
        capacity: unapprovedPlace.roomThree.capacity,
      },
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
  if (!id) res.json("no id found");
  const removePlace = await UnApprovedPlace.findByIdAndDelete(id);
  res.json(removePlace);
};

exports.approvedList = async (req, res) => {
  const city = req.query.city;
  let upperCasedFirstLetter;
  if (city) {
    upperCasedFirstLetter = city.charAt(0).toUpperCase() + city.slice(1);
  }
  const searchQuery = req.query.searchquery;
  let places;

  if (searchQuery && city) {
    places = await ApprovedPlace.find({
      $and: [{ name: searchQuery }, { city: upperCasedFirstLetter }],
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
  await fullData.save();

  const placeToUpdateBooking = await ApprovedPlace.findById(fullData.place._id);
  placeToUpdateBooking.bookings.push(fullData._id);
  await placeToUpdateBooking.save();

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

  res.json("Order has been approved");
};

exports.rejectOrder = async (req, res) => {
  const id = req.body.id;
  if (!id) res.json("no id found");

  const booking = await Booking.findById(id);
  booking.status = "Rejected";
  await booking.save();

  res.json("Order has been rejected");
};

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

  function betweenDates(bookingDate, bookedStartDate, bookedLastDate) {
    const result =
      bookingDate >= bookedStartDate && bookingDate <= bookedLastDate;
    return result;
  }

  let noError = false;
  const bookingStartDate = new Date(booking.startDate).getTime();
  const bookingLastDate = new Date(booking.lastDate).getTime();

  if (placeToUpdateBooking.bookings.length > 0) {
    const bookingsByRoomType = placeToUpdateBooking.bookings.filter(
      (book) => booking.roomType === book.roomType
    );

    if (!bookingsByRoomType.length > 0) {
      placeToUpdateBooking.bookings.push(booking._id);
      noError = true;
    } else {
      const placeBooked = bookingsByRoomType.every((book) => {
        const bookedStartDate = new Date(book.startDate).getTime();
        const bookedLastDate = new Date(book.lastDate).getTime();
        const edgeCase =
          bookingStartDate < bookedStartDate &&
          bookingLastDate > bookedLastDate;

        const result =
          !betweenDates(bookingStartDate, bookedStartDate, bookedLastDate) &&
          !betweenDates(bookingLastDate, bookedStartDate, bookedLastDate) &&
          !edgeCase;
        return result;
      });
      const result = placeBooked.every((r) => r);
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

exports.getAdminPanelCount = async (req, res) => {
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

// exports.getDashboardCount = async (req, res) => {
//   const ordersCount = await Booking.count();
//   const placesCount = await ApprovedPlace.count();
//   const unapprovedPlacesCount = await UnApprovedPlace.count();
//   const usersCount = await User.count();
//   res.json({
//     orders: ordersCount,
//     places: placesCount,
//     unapprovedPlaces: unapprovedPlacesCount,
//     users: usersCount,
//   });
// };

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

exports.addToFavourites = async (req, res) => {
  const userId = req.user.userId;
  const placeId = req.body.placeId;

  const userDoc = await User.findById(userId);
  const exist = userDoc.favourites.find((fav) => fav.toString() === placeId);
  if (!exist) {
    userDoc.favourites.push(placeId);
    userDoc.save();
  }

  res.json("place added to favourites");
};

exports.RemoveFromFavourites = async (req, res) => {
  const userId = req.user.userId;
  const placeId = req.body.placeId;

  const userDoc = await User.findById(userId);
  const newFavourites = userDoc.favourites.filter(
    (place) => place.toString() !== placeId
  );
  userDoc.favourites = newFavourites;
  userDoc.save();

  res.json("place removed from favourites");
};

exports.getFavourites = async (req, res) => {
  const complete = req.query.complete;
  const userId = req.user.userId;
  const data = await User.find({ _id: userId }).populate("favourites");

  if (!complete) {
    const ids = data[0].favourites.map((fav) => fav._id);
    res.json(ids);
  } else {
    res.json(data[0].favourites);
  }
};

exports.updateListing = async (req, res) => {
  const roomOnePrice = req.body.roomOnePrice;
  const roomTwoPrice = req.body.roomTwoPrice;
  const roomThreePrice = req.body.roomThreePrice;

  const placeId = req.body.placeId;

  if (!placeId) {
    res.json({ message: "place not found" });
  }

  if (!roomOnePrice && !roomTwoPrice && !roomThreePrice) {
    res.json("no prices were found");
  }

  const place = await ApprovedPlace.findOne({ _id: placeId });
  place.roomOne.price = roomOnePrice;
  place.roomTwo.price = roomTwoPrice;
  place.roomThree.price = roomThreePrice;
  await place.save();

  res.json(place);
};

exports.getListingBookings = async (req, res) => {
  const bookings = await Booking.find({}).populate("place user");
  const filteredBookings = bookings.filter(
    (booking) => booking.place.user.toString() === req.user.userId
  );
  res.json(filteredBookings);
};
