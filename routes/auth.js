const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const isAdmin = require("../middlewares/is_admin")
const isAuth = require('../middlewares/is-auth')

router.put('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/users', isAuth, isAdmin, authController.getUsers)
router.get('/user', isAuth, authController.getUserData)
router.post('/userupdate', isAuth, authController.updateUserData)

module.exports = router;