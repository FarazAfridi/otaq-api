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

router.post('/book',isAuth , placesController.bookPlace)
router.get('/book',isAuth, isAdmin , placesController.getBookedPlaces)

module.exports = router;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAMy5jb20iLCJ1c2VySWQiOiI2NDBhMThjZDFmNWEzODMyY2NlMjgyOGEiLCJpYXQiOjE2ODAxODY0MjIsImV4cCI6MTY4MDE5MDAyMn0.wO5Z-1-aSq55FTGolCWsJyqRpK0KmOx8RPRYq3Z_jO4

//64145996b61d8af97d2fb310