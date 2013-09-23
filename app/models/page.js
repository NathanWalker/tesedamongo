var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var PageSchema = new Schema({
  title: {type : String},
  subheading: {type : String},
  content: {type : String},
  route: {type: String},
  navShow:{type: Boolean},
  navName: {type: String},
  order: {type: Number},
  overviewVideo: {type: String},
  showBanner: {type: Boolean, default:false}
});

 PageSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).exec(cb);
   }
 };

mongoose.model('Page', PageSchema);
