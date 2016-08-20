var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  image_url: String,
  event_type: {type: String, enum: ["resource_encounter", "red_zone_encounter", "random_encounter"]},
  // resource - for when the player clicks on the resource
  // red zone - for random dangerous encounters in the red zone
  // random - for random normal encounters (i.e. flavour encounters)
  choices: []
}, {
  timestamps: true
});

// export the model
module.exports = mongoose.model('Event', eventSchema);