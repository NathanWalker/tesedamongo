var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var VideoSchema = new Schema({
  title: {type : String},
  url: {type : String},
  type: {type : String},
  poster: {type : Schema.ObjectId, ref: 'Image'},
  order: {type : Number},
  exclusive: {type : Boolean},
  tags: [{type: Schema.ObjectId, ref: 'Tag'}]
});

 VideoSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).populate('poster').populate('tags').exec(cb);
   }
 };

mongoose.model('Video', VideoSchema);
