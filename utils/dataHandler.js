// To handle the data, generate etag
var Tweet = require('../models/Tweet');
var etag = require('etag');

// var cachedEtag = null;  // to store Etag

module.exports = {
    
   updateEtag: function(app) {
      // Get the full tweet data from our database
     Tweet.getTweets(0, 0, function(tweets, pages) {
        
         app.locals.etag = etag(JSON.stringify(tweets));
         //res.set('ETag', cachedEtag);
         console.log("Etag in server = " + app.locals.etag); 
        
     });
   }
};