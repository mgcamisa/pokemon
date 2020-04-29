const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PokemonSchema = new Schema({
    name: {
	type: String,
	required: true
    },
    type: {
	type: String,
	required: true
    },
    type2: {
	type: String
    },
    sprite: {
	type: String,
	required: true

    }
});


// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
    team: {
	type: [PokemonSchema],
	default: []
    }
});

module.exports = User = mongoose.model("users", UserSchema);
