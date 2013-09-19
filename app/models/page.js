var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var PageSchema = new Schema({
  title: {type : String},
  subheading: {type : String},
  content: {type : String},
  route: {type: String}
});

 PageSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).exec(cb);
   }
 };

mongoose.model('Page', PageSchema);
