var Pc = require('../models/pc');

function pcsCreate(req, res) {
  Pc.create(req.body, function(err, pc) {
    if(err) return res.status(400).json(err);
    return res.status(201).json(pc);
  });
}

function pcsShow(req, res) {
  Pc.findById(req.params.id, function(err, pc) {
    if(err) return res.status(500).json(err);
    if(!pc) return res.status(404).json({ message: "I apparently don't exist with that ID. An existential crisis, if you will."});
    return res.status(200).json(pc);
  });
}

function pcsUpdate(req, res) {
  Pc.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }, function(err, pc) {
    if(err) return res.status(400).json(err);
    return res.status(200).json(pc);
  });
}

function pcsDelete(req, res) {
  Pc.findByIdAndRemove(req.params.id, function(err) {
    if(err) return res.status(500).json(err);
    return res.status(204).send();
  });
}

module.exports = {
  create: pcsCreate,
  show: pcsShow,
  update: pcsUpdate,
  delete: pcsDelete
}
