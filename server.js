var http = require('http');
var mongoose = require('mongoose');
var schedule = require('node-schedule');
var config = require('./config');
var TwitterStream = require('./twitter_stream/twitterStream');
var Tweet = require('./static/database');
var streamHandler = require('./static/tweetsHandling');
//keep track of the tweets currently displayed
var DisplayedTweets =require('./static/tweetsToDisplay');

var port = process.env.PORT || 8080;
// Connect to the mongo database
mongoose.connect('mongodb://localhost/popTweetsTracker');
// start the server
var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('Launching...');
});
server.listen(port, function() {
  console.log('Listening on ' + port);
});

//catch the twitter stream and track a specific hashtag
var tweetsStream = new TwitterStream(config.twitterStream);
var stream = tweetsStream.stream('statuses/filter', { track: config.display.hashtag });

//Tweet data treatment
streamHandler(stream,DisplayedTweets);

//Cleaning up the database regularly to get rid of unused data
var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, config.display.cleanup_interval);

schedule.scheduleJob(rule, function(){
	//the clean-up
	Tweet.purgeTweets( function() {
		console.log('The DB has been purged of tweets older than ' + config.display.tweet_timeout+ ' minutes.\n\n');
	});
	//updating the list of tweets to display
	Tweet.getTweets( function(tweets) {
		DisplayedTweets.updateDisplayedTweets(tweets);
		//PLACEHOLDER to: send the list to the client
		console.log('Updated list of tweets: \n' + tweets +'\n\n');
	});
});

