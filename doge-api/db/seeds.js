var mongoose = require('mongoose');
var bluebird = require('bluebird');
mongoose.Promise = bluebird;
var User = require('../models/user');
var Pc = require('../models/pc');
var Item = require('../models/item');
var Event = require('../models/event');

var databaseUri = require('../config/db')('development');
mongoose.connect(databaseUri);

User.collection.drop();
Pc.collection.drop();
Item.collection.drop();
Event.collection.drop();

Pc.create({
  image_url: "https://i.ytimg.com/vi/hEJnMQG9ev8/maxresdefault.jpg",
  health: 100,
  inventory: []
}).then(function(pc1) {
  console.log(pc1);
  return User.create({
    username: "Test",
    email: "test@test.com",
    first_name: "Testy",
    last_name: "McTest",
    password: "password",
    passwordConfirmation: "password",
    created_pc: [pc1]
  });
}).then(function(u1) {
  console.log(u1);
  return Item.create([{
    name: "Plank",
    description: "A normal 2x4 plank",
    image_url: "http://vignette2.wikia.nocookie.net/farmville/images/7/7d/Wood_Plank-icon.png/revision/latest?cb=20140201000329",
    item_type: "Weapon",
    item_attack: 5,
    item_defense: 0,
    item_heal: 0,
  }, {
    name: "Med-bag",
    description: "Filled with healing goodness",
    image_url: "http://www.cdc.gov/globalaids/images/icon_circumsision.png",
    image_type: "Consumable",
    item_attack: 0,
    item_defense: 0,
    item_heal: 50
  }, {
    name: "Sexy-Armour",
    description: "Sexy, yes. Armour, debatable",
    image_url: "https://cdn3.iconfinder.com/data/icons/objects/512/armor-128.png",
    item_type: "Armour",
    item_attack: 0,
    item_defense: 30,
    item_heal: 0
  }, {
    name: "Rosie's Rose",
    description: "A Rose, it smells funny",
    image_url: "https://cdn4.iconfinder.com/data/icons/flowers-2/500/Ecology_environment_flower_flowers_leaf_nature_plant_botanic_cultivated_eco_garden_rose_bouquet_1-512.png",
    image_attack: 0,
    image_defense: 10,
    item_heal: 0
  }]);
}).then(function(items) {
  console.log(items);
  return Event.create([{
    name: "Zombie Attack",
    description: "You are attacked by a zombie",
    image_url: "https://cdn0.iconfinder.com/data/icons/black-religious-icons/256/Zombie.png",
    event_type: "red_zone_encounter",
    choices: ["attack", "flee"]
  }, {
    name: "Yoga-Rosie",
    description:"A bizarre sight unravels before you. A girl is doing yoga on top of a van which is surrounded by zombies. She seems perfectly at ease.",
    image_url: "https://cdn0.iconfinder.com/data/icons/sport-and-fitness/500/Fitness_meditation_sport_yoga_Eexercise_exercises_fitness_gym_health-512.png",
    event_type: "random_encounter",
    choices: ["Curious you jump on the van next to her and join in", "Watch", "Run away"]
  }, {
    name: "Resource Found",
    description: "You found a resource",
    image_url: "https://s3.amazonaws.com/kinlane-productions/api-evangelist/services/api-management.png",
    event_type: "resource_encounter",
    choices: ["collect", "leave"]
  }]);
}).then(function(events) {
  console.log(events);
}).catch(function(err) {
  console.log(err);
}).finally(function() {
  mongoose.connection.close();
})