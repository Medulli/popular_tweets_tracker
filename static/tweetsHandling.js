var Tweet = require('./database');

//handles the stream of new tweets
var StreamHandling = function(stream,DisplayedTweets){

	// Catch event new tweet
	stream.on('tweet', function(tweet) {
		// Construct a new parsedTweet object
		var parsedTweet = {
		  tweetId: tweet['id'],
		  author: tweet['user']['name'],
		  avatar: tweet['user']['profile_image_url'],
		  body: tweet['text'],
		  date: tweet['created_at'],
		  screenname: tweet['user']['screen_name'],
		  retweets: tweet['retweet_count']
		};
		
		//check if retweet or normal tweet
		var isRetweet=  typeof(tweet['retweeted_status'])  != "undefined";

		if(isRetweet){
			// add 1 retweet to the original tweet. Will fail if the original tweet is too old (intended)
			var originalTweet_id  = tweet['retweeted_status']['id'];
			Tweet.update({ tweetId: originalTweet_id }, { $inc: { retweets: 1 }}).exec();
			
			//if the original tweet is not already displayed
			if ( !DisplayedTweets.isDisplayed(originalTweet_id) ){
				//recover the list of tweets to display
				Tweet.getTweets(function(tweets) {
					DisplayedTweets.updateDisplayedTweets(tweets);
					//PLACEHOLDER to: send the list to the client
					console.log('Updated list of tweets: \n' + tweets +'\n\n');
				});	
			} else {
				//if it is already displayed, only the data for this tweet is sent, to be updated on the client side.
				Tweet.getTweetToUpdate(originalTweet_id, function(tweet) {
					//PLACEHOLDER to: send the tweet to the client
					console.log('Updated single tweet: \n' + tweet +'\n\n');
				});
			}
		} else {
			// Create a new model instance with the tweet data
			var tweetEntry = new Tweet(parsedTweet);

			// Save the tweet to the database
			tweetEntry.save(function(err) {
			if (err) throw err;
			});
				
			//if less than max tweets are already displayed
			if(!DisplayedTweets.isDisplayFull){
				//recover the list of tweets to display
				Tweet.getTweets(function(tweets) {
					DisplayedTweets.updateDisplayedTweets(tweets);
					//PLACEHOLDER to: send the list to the client
					console.log('Updated list of tweets: \n' + tweets +'\n\n');
				});
			}
		}

	});
};

module.exports = StreamHandling;
