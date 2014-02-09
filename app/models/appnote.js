var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var AppNoteSchema = new Schema({
  name: {type : String},
  description: {type : String},
  order: {type: Number}
});

 AppNoteSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).exec(cb);
   }
 };

mongoose.model('AppNote', AppNoteSchema);
