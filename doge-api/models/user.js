var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var Pc = require("./pc")
var Item = require('./item');
// var beautifulUnique = require("mongoose-beautiful-unique-validation");

var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  image_url: String,
  health: { type: Number, default: 100 },
  inventory: [Item.schema],
  food: { type: Number, default: 100 },
  water: { type: Number, default: 100 },
  attack: { type: Number, default: 10 },
  armour: { type: Number, default: 10 }
});

userSchema.virtual("password")
  .set(function(password) {
    this._password = password;

    this.passwordHash = bcrypt.hashSync(this._password, bcrypt.genSaltSync(8));
  });

userSchema.virtual("passwordConfirmation")
  .get(function() {
    return this._passwordConfirmation;
  })
  .set(function(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

userSchema.path("passwordHash")
  .validate(function(passwordHash) {
    if(this.isNew) {
      if(!this._password) {
          return this.invalidate("password", "A password is needed, you idiot");
      }
      if(this._password !== this._passwordConfirmation) {
          return this.invalidate("passwordConfirmation", "Your passwords are not the same, you idiot");
      }
    }
  });

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash)
}

module.exports = mongoose.model('User', userSchema);