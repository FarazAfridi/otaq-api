const User = require("../models/user");

module.exports = (req, res, next) => {
  if (req.email) {
    User.findOne({ email: req.email })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "user not found" });
          return;
        }
        if(user.role !== 'Admin'){
            res.status(401).json({message: 'not authorized'})
            return;
        }
        next();
      })
      .catch((err) => {console.log(err); return;});
  }
  
};