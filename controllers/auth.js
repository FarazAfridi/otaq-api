const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt
    .hash(password, 10)
    .then((hashedPw) => {
      const user = new User({
        email,
        name,
        password: hashedPw,
        role: "User",
        listing: [],
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json(result);
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
      res.status(200).json({
        token,
        userId: loadedUser._id.toString(),
        userRole: loadedUser.role,
      });
    })
    .catch((err) => console.log(err));
};

exports.getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

exports.getUserData = async (req, res) => {
  const user = await User.find({ _id: req.user.userId });
  res.json(user);
};

exports.updateUserData = async (req, res) => {
  const user = await User.findById(req.user.userId);
  user.name = req.body.name;
  user.email = req.body.email;
  const password = req.body.password;

  bcrypt.compare(password, user.password, (err, data) => {
    //if error than throw error
    if (err) throw err;

    //if both match than you can do anything
    if (data) {

      user.save();
      return res.json(user);
    } else {

      bcrypt.hash(password, 10).then(hash => {
        console.log(hash)
        user.password = hash;
        user.save();
        return res.json(user);
      });     
    }
  });
  
};
