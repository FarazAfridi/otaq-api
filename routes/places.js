const express = require("express");

const router = express.Router();

const placesController = require("../controllers/place");
const isAuth = require("../middlewares/is-auth");
const isVendor = require("../middlewares/is_vendor");
const isAdmin = require("../middlewares/is_admin");

const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.originalname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
//     );
//   },
// });

// const upload = multer({ storage: storage });

const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});

router.get("/get/unapproved", isAuth, isAdmin, placesController.unApprovedList);
router.get("/get/approved", placesController.approvedList);
router.get("/get/approved/:id", placesController.getSinglePlace);
router.get("/get/booking", isAuth, placesController.getUserBookedPlaces);
router.get("/get/listing", isAuth, placesController.getUserListing);
router.post("/update/listing", isAuth, placesController.updateListing);
router.get("/get/favourites", isAuth, placesController.getFavourites);

router.post("/add/favourites", isAuth, placesController.addToFavourites);
router.post("/remove/favourites", isAuth, placesController.RemoveFromFavourites);

router.post(
  "/add",
  upload.fields([{ name: "room1" }, { name: "room2" }, { name: "room3" }]),
  isAuth,
  placesController.add
);
router.post(
  "/add/approved",
  upload.fields([{ name: "room1" }, { name: "room2" }, { name: "room3" }]),
  isAuth,
  isAdmin,
  placesController.AddToApprovedList
);
router.post(
  "/remove/unapproved",
  isAuth,
  isAdmin,
  placesController.removeUnApprovedPlace
);
router.post(
  "/remove/approved",
  isAuth,
  isAdmin,
  placesController.removeApprovedPlace
);

router.post("/book", isAuth, placesController.bookPlace);
router.post("/approve/order", isAuth,isAdmin, placesController.approveOrder);
router.post("/reject/order", isAuth,isAdmin, placesController.rejectOrder);
router.get("/book", isAuth, isAdmin, placesController.getBookedPlaces);
router.get("/get/listing/bookings", isAuth, placesController.getListingBookings);

router.get("/count", isAuth, isAdmin, placesController.getAdminPanelCount);

module.exports = router;
