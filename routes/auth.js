var express = require('express');
var userModel = require('../models/user');
var bcrypt = require('bcrypt');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('auth');
});

router.post('/register', function(req, res){
  const saltRounds = 10;
  bcrypt.hash(req.body.password.trim(), saltRounds, function(err, hash) {
  // Store hash in your password DB.
    var newUser = new userModel({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      username: req.body.username.trim(),
  		email : req.body.email.trim(),
  		password: hash,
      following: [],
      followers: []
  	});

  	newUser.save(function(err, user){
  		if(err) return console.error(err);
      // sets a cookie with the user's info
      req.session.user = user;
  		res.redirect('/home');
  	});
  });



});

router.post('/login', function(req, res){
  userModel.findOne({email: req.body.email.trim()},
  function(err, user){
    if (err){
			 res.render('auth', {authError: 'Something wrong with database'});
			 return console.error(err);
   	}
    // Load hash from your password DB.
    bcrypt.compare(req.body.password.trim(), user.password, function(err, result) {
      if (result){
        // sets a cookie with the user's info
        req.session.user = user;
        res.redirect('/home');
      }else{
	 		    res.render('auth', {authError: 'Incorrect Username or Password'});
     };
   });
  });


});

module.exports = router;
