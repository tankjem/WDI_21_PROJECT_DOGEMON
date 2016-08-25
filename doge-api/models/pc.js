var mongoose = require('mongoose');
var Item = require('./item');

var pcSchema = new mongoose.Schema({
  image_url: String,
  health: { type: Number, default: 100 },
  inventory: [Item.schema],
  food: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  armour: { type: Number, default: 10 }
}, {
  timestamps: true
});

// export the model
module.exports = mongoose.model('Pc', pcSchema);