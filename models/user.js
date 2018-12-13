const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Autopopulate = require('../utilities/autopopulate');
const Schema = mongoose.Schema;
const Comment = require("../models/comment")

const UserSchema = new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    password: { type: String, select: false },
    username: { type: String, required: true },
    email: { type: String, required: true },
    posts : [{ type: Schema.Types.ObjectId, ref: "Post"}],
    comments : [{ type: Schema.Types.ObjectId, ref:"Comment"}]

}).pre('findOne', Autopopulate('comments'))
	.pre('find', Autopopulate('comments'));

UserSchema.pre("save", function(next) {
    //SET createdAt && updatedAtss
    const now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }

    // ENCRYPT Password
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);
