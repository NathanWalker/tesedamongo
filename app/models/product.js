var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: {type : String},
  description: {type: String},
  content: {type : String},
  shortUrl: {type : String},
  featured: {type : Boolean},
  featureList: {type : String},
  featuredOrder:{type: Number}
});

 ProductSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).exec(cb);
   }
 };

mongoose.model('Product', ProductSchema);
