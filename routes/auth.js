var express = require('express');
var userModel = require('../models/user');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('auth');
});

router.post('/register', function(req, res){
	var newUser = new userModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
		email : req.body.email,
		password: req.body.password,
	});

	newUser.save(function(err, user){
		if(err) return console.error(err);
    // sets a cookie with the user's info
    req.session.user = user;
		res.redirect('/home');
	});

});

router.post('/login', function(req, res){
		userModel.findOne( {email: req.body.email, password: req.body.password}, function(err, user){
			 if (err){
				 res.render('auth', {authError: 'Something wrong with database'});
				 return console.error(err);
			 }
       if (user){
          // sets a cookie with the user's info
          req.session.user = user;
          res.redirect('/home');
       }else{
		 		 res.render('auth', {authError: 'Incorrect Username or Password'});
       };
	});
});

module.exports = router;
