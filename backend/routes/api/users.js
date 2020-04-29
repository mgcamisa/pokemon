const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");


// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");


// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
    
  const { errors, isValid } = validateRegisterInput(req.body);
    
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
    
User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
	
// Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});


// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
    
  const { errors, isValid } = validateLoginInput(req.body);
    
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
    
  const email = req.body.email;
  const password = req.body.password;
    
// Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
      
// Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
	  
// Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );

	  res.redirect('/dashboard' + req.user._id);
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});


// @route GET api/users/team
// @desc get a list of current user's pokemon team
// @access Public
router.get("/team", (req, res) => {
    const _id = req.query.id;
    const name = req.query.name;
    User.findOne({_id}).then( user => { res.send(user.team) });
})


// @route PUT api/users/update
// parameters: id, name, type, type2 (optional), sprite
// @desc add pokemon to user's team
// @access Public
router.put("/update", (req, res) => {
    // Check if pokemon already belongs to this user's team
    const poke = {"name": req.query.name, "type": req.query.type, "type2": req.query.type2, "sprite": req.query.sprite};
    const _id = req.query.id;
    User.findById({_id}, function (err, user) {
	var exists = false;
	for (i in user.team) {
	    if (user.team[i].name === poke.name) { exists = true; break; }
	}
	if (!exists) {
	    user.team.push(poke);
	    user.save();
	    res.send("Added " + poke.name + " to your team!");
	}
	else {
	    res.send("Error: this Pokemon already belongs to your team.");
	}
    }
		 )});

// @route PUT api/users/delete
// parameters: id and name
// @desc remove pokemon from user's team
// @access public
router.put("/delete", (req, res) => {
    const _id = req.query.id;
    User.findById({_id}, function (err, user) {
	var removed = false;
	for (var i in user.team) {
	    if (user.team[i].name === req.query.name) {
		user.team[i].remove();
		user.save();
		removed = true;
		res.send("Removed " + req.query.name + " from your team.");
		break;
	    }
	}
	if (!removed) {
	    res.send("Error: this Pokemon wasn't on your team.");
	}
    })
})


module.exports = router;
