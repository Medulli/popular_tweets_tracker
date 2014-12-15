var config = require('../config');
var maxTweets=config.display.tweet_count;

//keeps track of the tweets displayed
var TweetsToDisplay = module.exports = {
	displayedTweets_ids: [],
	
	//update the list of displayed tweets
	updateDisplayedTweets: function (tweets){
		var index=0;
		tweets.forEach(function(tweet){
			TweetsToDisplay.displayedTweets_ids[index]=tweet.tweetId; 
			index+=1;
		});
	},
	
	//check if a tweet is displayed by its id.
	isDisplayed: function(tweetId){
		return TweetsToDisplay.displayedTweets_ids.indexOf(tweetId) != -1;
	},
	
	//check if the max number of tweets to display is achieved
	isDisplayFull: function(){
		return TweetsToDisplay.displayedTweets_ids.length() == maxTweets;
	}
}
