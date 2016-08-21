// create an express router
var router = require('express').Router();

// require jwt stuff
var jwt = require("jsonwebtoken");
var secret = require("../config/tokens").secret;

// require our controller(s)
var authController = require('../controllers/authentications');
var usersController = require('../controllers/users');
var itemsController = require('../controllers/items');
var eventsController = require('../controllers/events');
var pcsController = require('../controllers/pcs');

// middleware to check for token
function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: "You are not allowed in because you're not cool enough."});

  var token = req.headers.authorization.replace("Bearer ", "")

  jwt.verify(token, secret, function(err, payload){
    if(err || !payload) return res.status(401).json({ message: "You are not allowed in because you're not cool enough."});

    req.user = payload;
    next();
  });
}


// Users - restful routes apart from index, create and delete

router.route('/users/:id')
  .get(usersController.show)
  .put(usersController.update)
  .patch(usersController.update)
// PC  - restful routes apart from index
router.route('/pcs')
  .post(pcsController.create);

router.route('/pcs/:id')
  .get(pcsController.show)
  .put(pcsController.update)
  .patch(pcsController.update)
  .delete(pcsController.delete);
// items - only show
router.route('/items/:id')
  .get(itemsController.show)
// event - only show
router.route('/events/:id')
  .get(eventsController.show)
// hook up our controller methods to urls/paths

router.post("/register", authController.register);
router.post("/login", authController.login);
// export the router
module.exports = router;
