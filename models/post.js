const mongoose = require("mongoose");
const Autopopulate = require('../utilities/autopopulate');
const Schema = mongoose.Schema;
const Comment = require("../models/comment.js");

const PostSchema = new Schema({
    createdAt:  { type: Date },
    updatedAt:  { type: Date },
    title:      { type: String, required: true },
    url:        { type: String, required: true },
    summary:    { type: String, required: true },
    subreddit:  { type: String, required: true },
    comments:   [{type: Schema.Types.ObjectId, ref: "Comment"}],
    upVotes :   [{ type: Schema.Types.ObjectId, ref: "User" }],
    downVotes:  [{ type: Schema.Types.ObjectId, ref: "User" }],
    voteScore:  { type: Number, default: 0 },
    //TODO: Display authors names not ID
    author :    { type: Schema.Types.ObjectId, ref: "User"}

}).pre('findOne', Autopopulate('comments'))
	.pre('find', Autopopulate('comments'));
// This needs older function call because of the this.
PostSchema.pre("save", function(next) {
    // Set the createdAt && updatedAt
    const now = new Date();
    this.updatedAt = now;

    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model("Post", PostSchema)
