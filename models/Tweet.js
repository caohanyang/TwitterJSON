var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    created_at       : String
  , id     : Number
  , id_str     : String
  , text     : String
  , source       : String
  , truncated       : Boolean
  , in_reply_to_status_id : Number
  , in_reply_to_status_id_str : String
  , in_reply_to_user_id : Number
  , in_reply_to_user_id_str : String
  , in_reply_to_screen_name : String
  , user : {
           id      : Number
          , id_str    : String
          , name   : String
          , screen_name    : String
          , location      : String
          , url      : String 
          , description: String
          , protected   : Boolean
          , verified    : Boolean
          , followers_count:     Number
          , friends_count:     Number
          , listed_count:     Number
          , favourites_count:     Number
          , statuses_count:     Number
          , created_at:     String
          , utc_offset:     Number
          , time_zone:     String
          , geo_enabled:    Boolean
          , lang    : String
          , contributors_enabled   : Boolean
          , is_translator   : Boolean
          , profile_background_color   : String
          , profile_background_image_url   : String
          , profile_background_image_url_https   : String
          , profile_background_tile    : Boolean
          , profile_link_color    : String
          , profile_sidebar_border_color    : String
          , profile_sidebar_fill_color    : String
          , profile_text_color    : String
          , profile_use_background_image   : Boolean
          , profile_image_url   : String
          , profile_image_url_https   : String
          , profile_banner_url    : String
          , default_profile   : Boolean
          , default_profile_image   : Boolean
          , following    : Boolean
          , follow_request_sent   : Boolean
          , notifications   : Boolean
        }
  , geo : Object
  , coordinates : Array
  , place : {
               attributes      : Object
              , bounding_box    : Object
              , country   : String
              , country_code    : String
              , full_name      : String
              , id      : String 
              , name      : String
              , place_type      : String
              , url      : String
            }
  , contributors : Array
  , is_quote_status : Boolean
  , retweet_count : Number
  , favorite_count : Number
  , entities : {
               hashtags      : Array
              , urls    : Array
              , user_mentions   : Array
              , symbols    : Array
            }
  , favorited       : Boolean
  , retweeted       : Boolean
  , possibly_sensitive : Boolean
  , filter_level       : String
  , lang       : String
  , timestamp_ms : String
  , active : { type: Boolean, default: false }   // Added field. default: false
});

// Create a static getTweets method to return tweet data from the db
schema.statics.getTweets = function(page, skip, callback) {
   
   var tweets = [];
       start = (page * 10) + (skip * 1);

   // Query the db, using skip and limit to achieve page chunks
   // Tweet.find({}, 'twid active author avatar body date screenname', { skip: start, limit: 10})
   Tweet.find({},{},{skip: start, limit: 10}).sort({created_at: 'desc'}).exec(function(err,docs){

   	   // If everything is cool...
   	   if(!err) {
   	   	 tweets = docs; //We got tweets
   	   	 tweets.forEach(function(tweet) {
   	   	 	tweet.active = true;  //Set them to active
   	   	 });
   	   }
       
       // Pass them bace to the specified callback
       // callback(docs);
       // console.log(docs);
       callback(tweets);

   });
};

// Return a Tweet model based upon the defined schema
module.exports = Tweet = mongoose.model('Tweet', schema);