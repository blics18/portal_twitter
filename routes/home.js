var express = require('express');
var tweetModel = require('../models/tweets');
var userModel = require('../models/user');
var auth = require('../utils/requireLogin');
var io = require('../io');
var router = express.Router();

router.use(auth.requireLogin);

/* GET home page. */
router.get('/', function(req, res) {
  userModel.findOne({"_id": req.user._id},
  function(err, user){
    if (err){
      return res.send(err);
    }else if(user){
      // var tweets = 0;
      tweetModel.count({"user.username": req.user.username},
      function(err, tweets){
        if (err){
          return res.send(err);
        }else{
          res.render('home',{
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            followersNum: user.followers.length,
            followingNum: user.following.length,
            tweetsNum: tweets
          });
        }
      })

    }else{
      res.status(404).send("404-User not found");
    }

  });
});

router.get('/loadTweets', function(req, res){
  userModel.findOne({"_id": req.user._id},
  function(err, user){
    if (err){
      return res.send(err);
    }
    if (user){
        tweetModel.find({$or: [{"user.username":{$in: user.following}}, {"user.username": req.user.username} ]},
        function(err, tweets){
          if (err){
            return res.send(err);
          }
          res.send(JSON.stringify(tweets));
        });
    }else{
      req.session.reset();
      res.redirect('/auth');
    }
  })
});

router.post('/submitTweet', function(req, res){
  var newDate = new Date();
  var newTweet = new tweetModel({
    user: req.user,
    date: newDate,
    tweet: req.body.tweetInput.trim()
  });

  // now, it's easy to send a message to just the clients in a given room
  room = req.user.username;
  data = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    username: req.user.username,
    date: newDate,
    tweet: req.body.tweetInput.trim()
  }

  io.instance().sockets.in(room).emit('message', data);

  newTweet.save(function(err, tweet){
    if (err){
      return res.send(err);
    }else{
      tweetModel.count({"user.username" : req.user.username},
      function(err, counter){
        if (err){
          return res.send(err);
        }else{
          res.send(JSON.stringify({
            username: tweet.user.username,
            firstName: tweet.user.firstName,
            lastName: tweet.user.lastName,
            tweet: tweet.tweet,
            date: tweet.date,
            tweetCounter: counter
          }));
        }
      });
    }

  })

});

router.get('/logout', function(req, res){
  req.session.reset();
  res.redirect('/auth');
});

module.exports = router;
