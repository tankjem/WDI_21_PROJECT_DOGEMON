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
  },{
    name: "Rosie's Rose",
    description: "A Rose, it smells funny",
    image_url: "https://cdn4.iconfinder.com/data/icons/flowers-2/500/Ecology_environment_flower_flowers_leaf_nature_plant_botanic_cultivated_eco_garden_rose_bouquet_1-512.png",
    image_attack: 0,
    image_defense: 10,
    item_heal: 0
    },{
    name: "Cricket Bat",
    description: "Howzat",
    image_url: "https://cdn1.iconfinder.com/data/icons/video-game-solid-2/48/67-128.png",
    item_type: "Weapon",
    image_attack: 30,
    image_defense: 0,
    item_heal: 0
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Light Tunic",
    description: "A lovely tunic",
    image_url: "./assets/items/A_Clothing01.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 10,
    item_heal: 0
    // WARNING WARNING WARNING 
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Medium Tunic",
    description: "Tunics are in this year...",
    image_url: "./assets/items/A_Clothing02.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 20,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Leather Armour",
    description: "A lovely tunic",
    image_url: "./assets/items/A_Armour01.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 25,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Iron Armour",
    description: "A lovely tunic",
    image_url: "./assets/items/A_Armour04.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 50,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Gold Armour",
    description: "Yes its a terrible idea but somehow its better than expected",
    image_url: "./assets/items/A_Armour03.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 65,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "The Mighty Doge Shield",
    description: "Tremble at its awesomeness",
    image_url: "./assets/items/E_Bones03.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 85,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Healing Potion",
    description: "I can't believe I drank the whole thing",
    image_url: "./assets/items/I_Antidote.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 70
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Bread",
    description: "What? Bread makes you fat?",
    image_url: "./assets/items/I_C_Bread.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 15
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Banana",
    description: "Great in a milkshake. Warning: May bring boys to the yard",
    image_url: "./assets/items/I_C_Banana.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 5
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Fish on a Stick",
    description: "Its a fish on a stick",
    image_url: "./assets/items/I_C_RawFish.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 25
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Steak",
    description: "Medium rare",
    image_url: "./assets/items/I_C_Meat.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 30
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Pineapple",
    description: "Great on pizza",
    image_url: "./assets/items/I_C_Pineapple.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 10
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Cheese",
    description: "A hunk of cheese",
    image_url: "./assets/items/I_C_Cheese.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 35
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Bow and Arrow",
    description: "Loosen the shaft...",
    image_url: "./assets/items/W_Bow01.png",
    item_type: "Weapon",
    image_attack: 20,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Fire Sword",
    description: "Sharp and flamey",
    image_url: "./assets/items/S_Sword01.png",
    item_type: "Weapon",
    image_attack: 45,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Hatchet",
    description: "I hope I don't lose a hand",
    image_url: "./assets/items/W_Axe001.png",
    item_type: "Weapon",
    image_attack: 25,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  }, {
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Machete",
    description: "Slash and gash",
    image_url: "./assets/items/W_Dagger005.png",
    item_type: "Weapon",
    image_attack: 40,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Dagger",
    description: "Stick 'em with the pointy end",
    image_url: "./assets/items/W_Dagger002.png",
    item_type: "Weapon",
    image_attack: 25,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Candy Cane",
    description: "Rock hard but very sweet",
    image_url: "./assets/items/W_Mace010.png",
    item_type: "Weapon",
    image_attack: 35,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Revolver",
    description: "Hello cowboy",
    image_url: "./assets/items/W_Gun001.png",
    item_type: "Weapon",
    image_attack: 40,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "9mm",
    description: "Pew-Pew",
    image_url: "./assets/items/W_Gun003.png",
    item_type: "Weapon",
    image_attack: 55,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Hammer",
    description: "Can't touch this",
    image_url: "./assets/items/W_Mace003.png",
    item_type: "Weapon",
    image_attack: 45,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Battle Axe",
    description: "A battle axe from years gone by",
    image_url: "./assets/items/W_Axe009.png",
    item_type: "Weapon",
    image_attack: 55,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Demon Bow",
    description: "Just a bow with a fancy name",
    image_url: "./assets/items/W_Bow13.png",
    item_type: "Weapon",
    image_attack: 35,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "A trident",
    description: "Not much different from a pitchfork",
    image_url: "./assets/items/W_Spear007.png",
    item_type: "Weapon",
    image_attack: 45,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
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
    name: "Consumable Found",
    description: "You found a consumable item",
    image_url: "./assets/events/resource_icon.png",
    event_type: "resource_encounter",
    choices: ["collect", "leave"]
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Armour Found",
    description: "You found some new armour",
    image_url: "./assets/events/resource_icon.png",
    event_type: "resource_encounter",
    choices: ["collect", "leave"]
    // WARNING WARNING WARNING
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Weapon Found",
    description: "You found a new weapon",
    image_url: "./assets/events/resource_icon.png",
    event_type: "resource_encounter",
    choices: ["collect", "leave"]
    // WARNING WARNING WARNING
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Survivor Fight",
    description: "Zombies aren't the only worry",
    image_url: "./assets/events/attack_icon.png",
    event_type: "random_encounter",
    choices: ["fight", "run", "hide"]
    // WARNING WARNING WARNING
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Baller",
    description: "You see a zombie lurches towards you, he seems to be saying something. You distinctly make out, Baaaaallllllerrrs! It shuffles past and offers a fist bump",
    image_url: "./assets/events/baller_icon.png",
    event_type: "random_encounter",
    choices: ["Leave it hanging", "Chop off Zombie's hand", "Bump back"]
    // WARNING WARNING WARNING
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "The Blue or the Red Pill",
    description: "You find a sealed bag on the floor containing two pills one red or blue. Curiosity get the better of you",
    image_url: "./assets/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Blue Pill", "Red Pill", "Winners don't do drugs"]
    // WARNING WARNING WARNING
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Lord Shu",
    description: "You see a man standing on top of a pile of bodies laughing maniacally",
    image_url: "./assets/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Join in with the laughing", "Attack", "Edge away slowly"]
    // WARNING WARNING WARNING
}]);
}).then(function(events) {
  console.log(events);
}).catch(function(err) {
  console.log(err);
}).finally(function() {
  mongoose.connection.close();
})