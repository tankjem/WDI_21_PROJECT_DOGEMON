// create an express router
var router = require('express').Router();

// require jwt stuff
var jwt = require("jsonwebtoken");
var secret = require("../config/tokens").secret;

// require our controller(s)
var authController = require('../controllers/authentications');
var userController = require('../controllers/user');
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

router.route('/user')
  .all(secureRoute)
  .get(userController.show)
  .put(userController.update)
  .patch(userController.update)
// PC  - restful routes apart from index
router.route('/pcs')
  .post(secureRoute, pcsController.create);

router.route('/pcs/:id')
  .all(secureRoute)
  .get(pcsController.show)
  .delete(pcsController.delete);
// items - only show

router.route('/items/:id')
  .get(secureRoute, itemsController.show)
// event - only show
router.get('/event', secureRoute, eventsController.show)
// hook up our controller methods to urls/paths

router.post("/register", authController.register);
router.post("/login", authController.login);
// export the router

module.exports = router;
