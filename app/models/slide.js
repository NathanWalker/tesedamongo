var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var SlideSchema = new Schema({
  markup: {type : String},
  image: {type: String},
  active: {type : Boolean, default:false},
  order: {type: Number}
});

 SlideSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).exec(cb);
   }
 };

mongoose.model('Slide', SlideSchema);
