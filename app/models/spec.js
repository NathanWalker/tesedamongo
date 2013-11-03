var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var SpecSchema = new Schema({
  name: {type : String},
  description: {type : String},
  fileSize: {type : Number},
  fileName: {type: 'String'},
  order: {type: Number}
});

 SpecSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).exec(cb);
   }
 };

mongoose.model('Spec', SpecSchema);
