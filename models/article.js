const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ArticleSchema = new Schema({
  title: {
    type: String,
    require: true,
  },

  author: {
    type: String,
    require: true,
  },

  avatar: {
    type: String,
    require: null,
  },
  tag: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
});

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
