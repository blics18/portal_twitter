var express = require('express');
var cors = require('cors');
var userModel = require('../models/user');
var bcrypt = require('bcrypt');
var router = express.Router();

router.get('/', cors({credentials: true, origin: true}), function(req, res, next) {
  res.render('auth');
});

router.post('/register', cors({credentials: true, origin: true}), function(req, res){
  console.log(req.header('Referer'));
  console.log(req.header('Origin'));
  // const saltRounds = 10;
  // bcrypt.hash(req.body.password.trim(), saltRounds, function(err, hash) {
  // Store hash in your password DB.
    var newUser = new userModel({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      username: req.body.username.trim(),
  		email : req.body.email.trim(),
  		password: userModel.hashPassword(req.body.password.trim()), //hash
      following: [],
      followers: []
  	});

  	newUser.save(function(err, user){
  		if(err) return console.error(err);
      // sets a cookie with the user's info
      req.session.user = user;
      if(req.header('Origin') === "http://localhost:4000"){
        res.render('tweetModal',{
          url: req.header('Referer')
        });
      }else{
        res.redirect('/home');
      }

  	});
  // });



});


router.post('/login', cors({credentials: true, origin: true}), function(req, res){
  userModel.findOne({email: req.body.email.trim()},
  function(err, user){
    if (err){
			 res.render('auth', {authError: 'Something wrong with database'});
			 return console.error(err);
   	}
    user.checkPassword(req.body.password.trim())
    .then(function(result){
      if (result){
        req.session.user = user;
        if(req.header('Origin') === "http://localhost:4000"){
          res.render('tweetModal',{
            url: req.header('Referer')
          });
        }else{
          res.redirect('/home');
        }
        // res.redirect('/home');
      }else{
        res.render('auth', {authError: 'Incorrect Username or Password'});
      }
    })
    .catch(function(err){
      console.error(err);
      res.status(500).send(err);
    })
    // Load hash from your password DB.
   //  bcrypt.compare(req.body.password.trim(), user.password, function(err, result) {
   //    if (result){
   //      // sets a cookie with the user's info
   //      req.session.user = user;
   //      res.redirect('/home');
   //    }else{
	 // 		    res.render('auth', {authError: 'Incorrect Username or Password'});
   //   };
   // });
  });


});

module.exports = router;
