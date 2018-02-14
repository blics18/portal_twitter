var express = require('express');
var tweetModel = require('../models/tweets');
var userModel = require('../models/user');
var auth = require('../utils/requireLogin');
var io = require('../io');
var router = express.Router();

router.use(auth.requireLogin);

router.get('/loadTweets/:username', function(req, res){
  tweetModel.find({"user.username": req.params.username.trim()},
    function(err, tweets){
      if (err){
        return res.send(err);
      }else{
        res.send(JSON.stringify(tweets));
      }

    });
});

router.post('/follow/:username', function(req, res){
  userModel.findOneAndUpdate({"username": req.user.username},
    {$addToSet: {following: req.params.username.trim()}},
    function(err, user){
      if (err){
        return res.send(err);
      }
  })

  userModel.findOneAndUpdate({"username": req.params.username.trim()},
    {$addToSet: {followers: req.user.username}},
    function(err, user){
      if (err){
        return res.send(err);
      }
  })

  res.end();

})
router.get('/:username', function(req, res){
  if (req.params.username.trim() == req.user.username){
    res.redirect('/home');
  }
  else{
    userModel.findOne({"username": req.params.username.trim()},
    function(err, user){
        if (err){
          return res.send(err);
        }
        if (user){
          res.render('profile',{
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
          });
        }else{
          res.status(404).send("404 - User not found");
      }
    });
  }

});

module.exports = router;
