# Popular tweets on a specific hashtag tracker

Simple Node.js server tracking the most retweeted tweets given a hashtag.

## Requirements

- Node.js
- npm
- MongoDB


## Installing

- Install MongoDB: `https://www.mongodb.org/downloads` You can find the installation instructions in the docs: `http://docs.mongodb.org/manual/installation/`
- Clone the repo in a local folder
- From this folder, install dependencies: `npm install`
- Fill in the credentials for the Twitter API in `config.js` (you need a twitter account and to create an app on the website: `https://apps.twitter.com/`)
- Create a local MongoDB database called `popTweetsTracker`

## Use

Start the server using `node server.js`