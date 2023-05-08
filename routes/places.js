const express = require("express");
const router = express.Router();
const placesController = require("../controllers/place");
const isAuth = require('../middlewares/is-auth')
const isVendor = require("../middlewares/is_vendor")
const isAdmin = require("../middlewares/is_admin")

const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
  }
})

const upload = multer({ storage: storage })

router.get('/get/unapproved',isAuth, isAdmin, placesController.unApprovedList)
router.get('/get/approved', placesController.approvedList)
router.get('/get/approved/:id', placesController.getSinglePlace)

router.post('/add', upload.array('images'), isAuth, isVendor, placesController.add)
router.post('/add/approved',isAuth, isAdmin, placesController.AddToApprovedList)
router.post('/remove/unapproved',isAuth, isAdmin, placesController.removeUnApprovedPlace)
router.post('/remove/approved',isAuth, isAdmin, placesController.removeApprovedPlace)

router.post('/book',isAuth , placesController.bookPlace)
router.get('/book',isAuth, isAdmin , placesController.getBookedPlaces)

router.get('/count',isAuth, isAdmin , placesController.getCount)

module.exports = router;

