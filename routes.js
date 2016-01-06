var JSX = require('node-jsx').install();
var React = require('react');
var TweetsApp = React.createFactory(require('./components/TweetsApp.react'));
var Tweet = require('./models/Tweet');

module.exports = {

   index: function(req, res) {
 
     // Call static model method to get tweets in the db
     console.log("----------------REFRESH: data from database------------------------");
     // Get the full tweet data from our database
     Tweet.getTweets(0, 0, function(tweets, pages) {

         // Construct a list of particial tweet(applicationTweets) for the specfici application
         var applicationTweets = [];
         // Loop the tweets from database
         tweets.forEach(function(tw) {
          var tweet = {
             twid: tw['id_str'],
             active: tw['active'],
             author: tw['user']['name'],
             avatar: tw['user']['profile_image_url'],
             body:   tw['text'],
             date:   tw['created_at'],
             screenname: tw['user']['screen_name']
          };
          applicationTweets.push(tweet);
         });
         
         // send the particial tweets list

         // Render React to a string, passing in our fetched tweets
         var markup = React.renderToString(
             TweetsApp({
             	tweets: applicationTweets
              })
            
         	);

          // JSON.parse(jsontext);
          // tweets = '{'+JSON.stringify(tweets).replace('[', '').replace(']', '')+'}';
          // console.log(JSON.parse(tweets));
          // tweets = JSON.stringify(eval('('+tweets+')'));
          // console.log(JSON.parse(markup));
          // Render our 'home' template
          res.render('home', {
          	markup: markup,    // Pass rendered react markup
          	state: JSON.stringify(applicationTweets) // Pass current state to client side
          });

     });
   },

   page: function(req, res) {
   	// Fetch tweets by page via param
   	Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {
        console.log("===========route for page=================");
        // Render as JSON
        res.send(tweets);
   	});
   }

};