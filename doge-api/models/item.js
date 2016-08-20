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

// export the model
module.exports = mongoose.model('Item', itemSchema);