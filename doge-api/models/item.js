var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  image_url: String,
  item_type: {type: String, enum: ["Consumable", "Weapon", "Armour", "Miscellaneous"]},
  item_attack: Number,
  item_defense: Number,
  item_heal: Number
});

itemSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};


// export the model
module.exports = mongoose.model('Item', itemSchema);