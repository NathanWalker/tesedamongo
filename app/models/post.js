var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {type : String},
  content: {type : String},
  date: {type : Date},
  image: {type : String}
});

 PostSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).exec(cb);
   }
 };

mongoose.model('Post', PostSchema);
