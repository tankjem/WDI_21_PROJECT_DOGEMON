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



Item.create([{
    name: "Plank",
    description: "A normal 2x4 plank",
    image_url: "http://vignette2.wikia.nocookie.net/farmville/images/7/7d/Wood_Plank-icon.png/revision/latest?cb=20140201000329",
    item_type: "Weapon",
    item_attack: 5,
    item_defense: 0,
    item_heal: 0
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
    description: "A Rose, it smells pretty",
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
    image_url: "/items/A_Clothing01.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 10,
    item_heal: 0
    // WARNING WARNING WARNING 
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Medium Tunic",
    description: "Tunics are in this year...",
    image_url: "/items/A_Clothing02.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 20,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Leather Armour",
    description: "A lightweight leather bodypiece.",
    image_url: "/items/A_Armour01.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 25,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Iron Armour",
    description: "Solid metal body armour.",
    image_url: "/items/A_Armour04.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 50,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Gold Armour",
    description: "Yes, its a terrible idea. But somehow its better than expected",
    image_url: "/items/A_Armour03.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 65,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "The Mighty Doge Shield",
    description: "Tremble at its awesomeness",
    image_url: "/items/E_Bones03.png",
    item_type: "Armour",
    image_attack: 0,
    image_defense: 85,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Healing Potion",
    description: "I can't believe I drank the whole thing",
    image_url: "/items/I_Antidote.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 70
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Bread",
    description: "What? Bread makes you fat?",
    image_url: "/items/I_C_Bread.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 15
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Banana",
    description: "Great in a milkshake. Warning: May bring boys to the yard",
    image_url: "/items/I_C_Banana.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 5
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Fish on a Stick",
    description: "It's a fish on a stick.",
    image_url: "/items/I_C_RawFish.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 25
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Steak",
    description: "Medium rare",
    image_url: "/items/I_C_Meat.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 30
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Pineapple",
    description: "If you put this on pizza, you deserve to get eaten by zombies.",
    image_url: "/items/I_C_Pineapple.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 10
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Cheese",
    description: "A hunk of cheese",
    image_url: "/items/I_C_Cheese.png",
    item_type: "Consumable",
    image_attack: 0,
    image_defense: 0,
    item_heal: 35
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Bow and Arrow",
    description: "Loosen the shaft...",
    image_url: "/items/W_Bow01.png",
    item_type: "Weapon",
    image_attack: 20,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Fire Sword",
    description: "Sharp and flamey",
    image_url: "/items/S_Sword01.png",
    item_type: "Weapon",
    image_attack: 45,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Hatchet",
    description: "I hope I don't lose a hand",
    image_url: "/items/W_Axe001.png",
    item_type: "Weapon",
    image_attack: 25,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  }, {
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Machete",
    description: "Slash and gash",
    image_url: "/items/W_Dagger005.png",
    item_type: "Weapon",
    image_attack: 40,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Dagger",
    description: "Stick 'em with the pointy end",
    image_url: "/items/W_Dagger002.png",
    item_type: "Weapon",
    image_attack: 25,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Candy Cane",
    description: "Rock hard but very sweet",
    image_url: "/items/W_Mace010.png",
    item_type: "Weapon",
    image_attack: 35,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Revolver",
    description: "Hello cowboy",
    image_url: "/items/W_Gun001.png",
    item_type: "Weapon",
    image_attack: 40,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "9mm",
    description: "Pew-Pew",
    image_url: "/items/W_Gun003.png",
    item_type: "Weapon",
    image_attack: 55,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Hammer",
    description: "Can't touch this",
    image_url: "/items/W_Mace003.png",
    item_type: "Weapon",
    image_attack: 45,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Battle Axe",
    description: "A battle axe from years gone by",
    image_url: "/items/W_Axe009.png",
    item_type: "Weapon",
    image_attack: 55,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Demon Bow",
    description: "Just a bow with a fancy name",
    image_url: "/items/W_Bow13.png",
    item_type: "Weapon",
    image_attack: 35,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "A trident",
    description: "Not much different from a pitchfork",
    image_url: "/items/W_Spear007.png",
    item_type: "Weapon",
    image_attack: 45,
    image_defense: 0,
    item_heal: 0
    // WARNING WARNING WARNING
}]).then(function(items) {
  console.log(items);
  return Pc.create({
  image_url: "https://i.ytimg.com/vi/hEJnMQG9ev8/maxresdefault.jpg",
  health: 69,
  inventory: [items[6], items[7], items[8], items[9], items[10], items[5]],
  hunger: 37,
  thirst: 45,
  armour: 10
  })
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
  return Event.create([{
    name: "Zombie Attack",
    description: "You are attacked by a zombie",
    image_url: "https://cdn0.iconfinder.com/data/icons/black-religious-icons/256/Zombie.png",
    event_type: "red_zone_encounter",
    choices: ["attack", "flee"],
    event_number:1
    }, {
    name: "Yoga-Rosie",
    description:"A bizarre sight unravels before you. A girl is doing yoga on top of a van which is surrounded by zombies. She seems perfectly at ease.",
    image_url: "https://cdn0.iconfinder.com/data/icons/sport-and-fitness/500/Fitness_meditation_sport_yoga_Eexercise_exercises_fitness_gym_health-512.png",
    event_type: "random_encounter",
    choices: ["Curious you jump on the van next to her and join in", "Watch", "Run away"],
    event_number: 2
    }, {
    name: "Consumable Found",
    description: "You found a consumable item",
    image_url: "/events/resource_icon.png",
    event_type: "resource_encounter",
    choices: ["collect", "leave"],
    event_number:3
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Armour Found",
    description: "You found some new armour",
    image_url: "/events/resource_icon.png",
    event_type: "resource_encounter",
    choices: ["collect", "leave"],
    event_number:4
    // WARNING WARNING WARNING
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Weapon Found",
    description: "You found a new weapon",
    image_url: "/events/resource_icon.png",
    event_type: "resource_encounter",
    choices: ["collect", "leave"],
    event_number:5
    // WARNING WARNING WARNING
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Survivor Fight",
    description: "Zombies aren't the only worry",
    image_url: "/events/attack_icon.png",
    event_type: "random_encounter",
    choices: ["fight", "run", "hide"],
    event_number:6
    // WARNING WARNING WARNING
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Ballers",
    description: "You see a zombie lurches towards you, he seems to be saying something. You distinctly make out, Baaaaallllllerrrs! It shuffles past and offers a fist bump",
    image_url: "/events/baller_icon.png",
    event_type: "random_encounter",
    choices: ["Leave it hanging", "Chop off Zombie's hand", "Bump back"],
    event_number:7
    // WARNING WARNING WARNING
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "The Blue or the Red Pill",
    description: "You find a sealed bag on the floor containing two pills one red or blue. Curiosity get the better of you",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Blue Pill", "Red Pill", "Winners don't do drugs"],
    event_number:8
    // WARNING WARNING WARNING
    },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Lord Shu",
    description: "You see a man standing on top of a pile of bodies laughing maniacally",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Join in with the laughing", "Attack", "Edge away slowly"],
    event_number:9
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Cam's Armour Emporium",
    description: "A young lad is on the side of the road pushing a shopping trolley filled with armour, he makes an offer you can't refuse",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Take the sexy armour", "Attack", "Ignore"],
    event_number:10
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "A Chanse Encounter",
    description: "A very pretty and athletic man is passed out by the side of the motorway, you wake him and give him some water. He tells you he's from Leeds and that he's pretty hungover. He says you should visit him in Leeds at some point. Wait. Did he mention he was from Leeds?",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Where's Leeds?", "Sorry, where are you from again?", "I'd love to visit Leeds"],
    event_number:11
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "The Screaming Kiwi",
    description: "You see a tall man with a semi-afro riding a bike and eating kebab, while blasting recorder music out of a radio strapped to the bike. He screams at a zombie and nearly drops his kebab",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Ask where he got the kebab?", "Attack", "Steal Kebab"],
    event_number:12
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Sleepy Jason",
    description: "A man is napping in a dumpster. There is a name tag on his shirt that says Jason",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Wake him up", "Ignore him", "Steal Everything"],
    event_number:13
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Zombie Fishing",
    description: "You see a man in shorts with a speargun by a pond. He fires the speargun into the pond and catches a fish",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Ask for a fish", "Attack", "Ignore"],
    event_number:14
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Bex's Utopia",
    description: "You encounter a woman with a steely look in her eyes, she seems completely at ease in the apocalyptic environment. She grins like a cheshire cat as she bashes in a zombies head",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Ask her why she's happy", "Bash a nearby zombie", "Run away"],
    event_number:15
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Jem's Gem",
    description: "A man is decked out in the finset gems you have ever seen. He looks like a king. He smiles at you and waves regally",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Wave back", "Make a danger face at him", "Run away"],
    event_number:16
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Smithy's business",
    description: "A man is sat atop a grassy knoll on what can only be described as a portable deck chair. The sun is shining and all is calm. He seems busy",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Join him atop the knoll", "Ask about chair", "Enjoy the sunshine and carry on"],
    event_number:17
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Adri's Apocalypse",
    description: "A lady is walking casually down the street. She seems pretty chilled and oblivious to the danger all around her, or she just doesn't care...",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Warn her about the danger", "Make a new friend", "Chill"],
    event_number:18
    // WARNING WARNING WARNING
  },{
    // WARNING THIS USES A URL FROM THE ASSETS FOLDER
    name: "Queen Kaitlyn",
    description: "You stumble across what appears to be an empty building. However, a woman appears surrounded several minions. One of the minions tugs on the sleeve of the lady. It is swiftly punted away.",
    image_url: "/events/event_marker.png",
    event_type: "random_encounter",
    choices: ["Punt the minion back", "Wave", "Run Away"],
    event_number:19
    // WARNING WARNING WARNING
  }]);
}).then(function(events) {
  console.log(events);
}).catch(function(err) {
  console.log(err);
}).finally(function() {
  mongoose.connection.close();
})