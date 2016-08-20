var mongoose = require ('mongoose');
var User = require ('../models/user');
var Pc = require ('../models/pc');
var Item = require ('../models/item');
var Event = require('../models/event');

var databaseUri = require('../config/db')('development');
mongoose.connect(databaseUri);

User.collection.drop();
Pc.collection.drop();
Item.collection.drop();
Event.collection.drop();

Item.create([{
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
  item_heal: 0,
}, {
  name: "Rosie's Rose"
  description: "A Rose, it smells funny",
  image_url: "https://cdn4.iconfinder.com/data/icons/flowers-2/500/Ecology_environment_flower_flowers_leaf_nature_plant_botanic_cultivated_eco_garden_rose_bouquet_1-512.png",
  image_attack: 0,
  image_defense: 10,
  item_heal: 0
}, {
  
}
])