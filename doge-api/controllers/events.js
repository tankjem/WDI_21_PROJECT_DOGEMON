var Event = require('../models/event');

function eventsShow(req, res) {
  Event.findById(req.params.id, function(err, event) {
    if(err) return res.status(500).json(err);
    if(!event) return res.status(404).json({ message: "I apparently don't exist with that ID. An existential crisis, if you will."});
    return res.status(200).json(event);
  });
}

module.exports = {
  show: eventsShow
}
