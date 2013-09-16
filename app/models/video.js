var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var VideoSchema = new Schema({
  title: {type : String},
  url: {type : String},
  type: {type : String},
  poster: {type : String},
  exclusive: {type : Boolean}
});

 VideoSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).exec(cb);
   }
 };

mongoose.model('Video', VideoSchema);
