var Tweet = require('../models/Tweet');

module.exports = function(stream, io) {
    
    // When tweets get sent our way ...
    stream.on('data', function(data) {
 
       if (data['user'] !== undefined) {

       	  // Construct a new tweet object
       	  var tweet = {
             twid: data['id_str'],
             active: false,
             author: data['user']['name'],
             avatar: data['user']['profile_image_url'],
             body:   data['text'],
             date:   data['created_at'],
             screenname: data['user']['screen_name']
       	  };

          // console.log("=====================================");

       	  // Create a new model instance with our object
          // Save the full twitter data to our database
       	  var tweetEntry  = new Tweet(data);

       	  // Save 'er to the database
       	  tweetEntry.save(function(err) {
             if (!err) {
                console.log("============SAVE OK===============");
                // If everything is cool, socket.io emits the tweet.
                // Emit only the particial one
                io.emit('tweet', tweet);
                console.log("============EMIT OK===============");
             }
       	  });
       }
    });
};