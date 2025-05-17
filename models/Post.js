const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  author: String,
  slug: { type: String, unique: true },
  canonicalUrl: String,
  metaTitle: String,
  metaDescription:String,
  story: String,
  voiceurl:String,
  categories:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags:[{type: mongoose.Schema.Types.ObjectId, ref:'Tags'}],
  likes: { type: Number, default: 0 },
  comments: [],
  isvarified:{type:Boolean , default:false}
});


module.exports = mongoose.model('Post', postSchema);