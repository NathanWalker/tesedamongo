var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var ImageSchema = new Schema({
  url: {type : String},
  created: {type: Date, default : Date.now}
});

 ImageSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).exec(cb);
   }
 };

mongoose.model('Image', ImageSchema);
