var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var BannerSchema = new Schema({
  title: {type : String},
  route: {type : String},
  slides: [{type: Schema.ObjectId, ref: 'Slide'}]
});

 BannerSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).populate('slides').exec(cb);
   }
 };

mongoose.model('Banner', BannerSchema);
