var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  image_url: String,
  event_type: {type: String, enum: ["resource_encounter", "red_zone_encounter", "random_encounter"]},
  // resource - for when the player clicks on the resource
  // red zone - for random dangerous encounters in the red zone
  // random - for random normal encounters (i.e. flavour encounters)
  choices: [],
  event_number: Number
}, {
  timestamps: true
});

eventSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

// export the model
module.exports = mongoose.model('Event', eventSchema);