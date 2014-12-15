
var mongoose = require('mongoose');
var config = require('../config');
var maxTweets=config.display.tweet_count;
var tweetTimeout=config.display.tweet_timeout;

// Create a new schema to store the tweets data
var schema = new mongoose.Schema({
    tweetId       : Number
  , author     : String
  , avatar     : String
  , body       : String
  , date       : Date
  , screenname : String
  , retweets : Number
});

// Create a static getTweets method to return tweet data from the db
schema.statics.getTweets = function(callback) {

  var tweets = [];

  // Query the db
  Tweet.find({},'tweetId author avatar body date screenname retweets').sort({retweets: 'desc', date: 'desc'}).limit(maxTweets).exec(function(err,docs){

    if(!err) {
      tweets = docs;  // We got tweets      
    } else throw err;

    // Pass them back to the specified callback
    callback(tweets);

  });

};

schema.statics.getTweetToUpdate = function(tweet_id, callback) {

  var tweets = [];

  // Query the db
  Tweet.findOne({tweetId: tweet_id},'tweetId author avatar body date screenname retweets').exec(function(err,docs){

    if(!err) {
      tweets = docs;  // We got tweets      
    } else throw err;

    // Pass them back to the specified callback
    callback(tweets);

  });

};

// Static clean-up method to purge the db of tweets older than 10min
schema.statics.purgeTweets = function(callback) {

	var limitDate=new Date();
	limitDate.setMinutes(limitDate.getMinutes() - tweetTimeout);
	limitDate.toISOString();
	
	// find old tweets and remove them
	Tweet.find({ date: { $lt: limitDate } }).remove().exec(function(err){
		if(err) throw err;
		// Pass them back to the specified callback
		callback();
	});

};

// Return a Tweet model based upon the defined schema
module.exports = Tweet = mongoose.model('Tweet', schema);
