var Item = require('../models/item');

function itemsShow(req, res) {
  Item.findById(req.params.id, function(err, item) {
    if(err) return res.status(500).json(err);
    if(!item) return res.status(404).json({ message: "I apparently don't exist with that ID. An existential crisis, if you will."});
    return res.status(200).json(item);
  });
}

module.exports = {
  show: itemsShow
}
