var JSX = require('node-jsx').install();
var React = require('react');
var TweetsApp = React.createFactory(require('./components/TweetsApp.react'));
var Tweet = require('./models/Tweet');
var etag = require('etag');
var fresh = require('fresh');

// var cachedEtag = null;  // to store Etag


module.exports = {

   index: function(req, res) {
     console.log("--------------------Begin----------------------------");
     //Server side set 404 to test
     // res.status(404).end();

     //check res length
     console.log("Res etag = " + res.app.locals.etag );
     console.log("Res etag = " + res.get('ETag'));
     console.log("Req etag = " + req.headers["if-none-match"]);
     // check etag
     console.log(req.fresh);
     
     // return the 304 if the Etag is the same
     if (req.headers["if-none-match"] !== null) {
         // Except First time
         if (res.app.locals.etag === req.headers["if-none-match"]) {
             return res.status(304).end();
         }
     }
     

     // Call static model method to get tweets in the db
     console.log("----------------REFRESH: data from database------------------------");
     // Get the full tweet data from our database
     Tweet.getTweets(0, 0, function(tweets, pages) {
        
         // Test the length of the data
         console.log("TweetsLength = " + JSON.stringify(tweets).length);
          
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

          // Reset the etag
          // res.setHeader('ETag', etag(JSON.stringify(applicationTweets)));
          res.app.locals.etag = etag(JSON.stringify(tweets));
          // lastModify = ...
          res.set('ETag', res.app.locals.etag);

          // Render our 'home' template
          res.render('home', {
          	markup: markup,    // Pass rendered react markup
          	state: JSON.stringify(applicationTweets) // Pass current state to client side
          }, function(err, html) {
             console.log("html length =" + html.length);
             // if a callback is specified, the rendered HTML string has to be sent explicitly
             res.send(html);
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