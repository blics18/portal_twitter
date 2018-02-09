var express = require('express');
var tweetModel = require('../models/tweets');
var userModel = require('../models/user');
var auth = require('../utils/requireLogin');
var router = express.Router();

router.use(auth.requireLogin);

/* GET home page. */
router.get('/', function(req, res) {
  userModel.findOne({"email": req.user.email},
  function(err, user){
    if (err){
      return res.send(err);
    }
    res.render('home',{
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    });
  });
});

router.get('/loadTweets', function(req, res){
  tweetModel.find({},
  function(err, tweets){
    if (err){
      return res.send(err);
    }
    res.send(JSON.stringify(tweets));
  });
});
router.post('/submitTweet', function(req, res){
  var newTweet = new tweetModel({
    user: req.user,
    date: new Date(),
    tweet: req.body.tweetInput.trim()
  });

  newTweet.save(function(err, tweet){
    if (err){
      return res.send(err);
    }
    res.send(JSON.stringify({
      username: tweet.user.username,
      firstName: tweet.user.firstName,
      lastName: tweet.user.lastName,
      tweet: tweet.tweet,
      date: tweet.date
    }));
  })
});

router.get('/logout', function(req, res){
  req.session.reset();
  res.redirect('/auth');
});

module.exports = router;
