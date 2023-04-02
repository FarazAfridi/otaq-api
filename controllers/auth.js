<<<<<<< HEAD
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  console.log(email, password, name)

  bcrypt
    .hash(password, 10)
    .then((hashedPw) => {
      const user = new User({
        email,
        name,
        password: hashedPw,
        role: 'User'
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User created",
        userId: result._id,
      });
    })
    .catch((err) => console.log(err));
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("A user with this email could not be found");
        return;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        console.log("Wrong password");
        return;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({
          token,
          userId: loadedUser._id.toString(),
          userRole: loadedUser.role,
        });
    })
    .catch((err) => console.log(err));
=======
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  console.log(email, password, name)

  bcrypt
    .hash(password, 10)
    .then((hashedPw) => {
      const user = new User({
        email,
        name,
        password: hashedPw,
        role: 'User'
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User created",
        userId: result._id,
      });
    })
    .catch((err) => console.log(err));
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("A user with this email could not be found");
        return;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        console.log("Wrong password");
        return;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({
          token,
          userId: loadedUser._id.toString(),
          userRole: loadedUser.role,
        });
    })
    .catch((err) => console.log(err));
>>>>>>> 46bedab (api deploy)
};