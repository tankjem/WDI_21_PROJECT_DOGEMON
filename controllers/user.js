var User = require('../models/user');

function userShow(req, res) {
  User.findById(req.user._id, function(err, user) {
    if(err) return res.status(500).json(err);
    if(!user) return res.status(404).json({ message: "I apparently don't exist with that ID. An existential crisis, if you will."});
    return res.status(200).json(user);
  });
}

function userUpdate(req, res) {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true }, function(err, user) {
    if(err) return res.status(400).json(err);
    return res.status(200).json(user);
  });
}

module.exports = {
  show: userShow,
  update: userUpdate,
}
