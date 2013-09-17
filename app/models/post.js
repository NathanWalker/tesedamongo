var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {type : String},
  content: {type : String},
  created: {type : Date, default : Date.now},
  image: {type : Schema.ObjectId, ref: 'Image'},
  tags: [{type: Schema.ObjectId, ref: 'Tag'}]
});

 PostSchema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).populate('image').populate('tags').exec(cb);
   }
 };

mongoose.model('Post', PostSchema);
