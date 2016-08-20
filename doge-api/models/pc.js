var mongoose = require('mongoose');

var pcSchema = new mongoose.Schema({
  image_url: String,
  health: Number,
  inventory: [Item.schema]
}, {
  timestamps: true
});

// export the model
module.exports = mongoose.model('Pc', pcSchema);