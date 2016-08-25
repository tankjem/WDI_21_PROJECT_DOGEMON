var Event = require('../models/event');

function eventsShow(req, res) {
  Event.random(function(err, event) {
    if(err) return res.status(500).json(err);
    return res.status(200).json(event);
  });
}

module.exports = {
  show: eventsShow
}
