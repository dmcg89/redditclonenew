const mongoose = require("mongoose");
const Autopopulate = require('../utilities/autopopulate');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content : { type: String },
    // author  :  { type: Schema.Types.ObjectId, ref: "User"  },
    author:  { type: Schema.Types.ObjectId, ref: "User" , required: true},
    postId    : { type: Schema.Types.ObjectId, ref: "Post", required: true},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    // postId:  { type: Schema.Types.ObjectId, ref: 'Post', required: true },
}).pre('findOne', Autopopulate('comments'))
    .pre('find', Autopopulate('comments'))

module.exports = mongoose.model("Comment", CommentSchema);
