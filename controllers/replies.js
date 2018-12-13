const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

module.exports = (app) => {
    //New Reply
    // /posts/{{post._id}}/comments/{{comment._id}}/replies/new
    app.get("/posts/:postId/comments/:commentId/replies/new", (req, res) => {
        var currentUser = req.user
        let post;
        Post.findById(req.params.postId)
            .then(post => {


                Comment.findById(req.params.commentId).then((comment) => {
                    console.log(comment);
                    res.render("replies-new", { post , comment, currentUser });
                })
            })
            .catch(err => {
                console.log(err.message);
            })
    })



app.post('/posts/:postId/comments/:commentId/replies', (req, res) => {
    var currentUser = req.user
      if (currentUser === null) {


        return res.redirect('/login');
      }
    // INSTANTIATE INSTANCE OF EMBER MODEL
    const comment = new Comment(req.body);
    comment.author = req.user._id;
    comment.postId = req.params.postId
    comment
        .save()
        // Find Parent Comment
        .then(() => {
            return Comment.findById(req.params.commentId)
        })
        .then((parent) => {
            parent.comments.unshift(comment)
            parent.save()
        })
        // Find the Pyromancer author
        .then(() => {
            return User.findById(req.user._id);
        })
        // Save the author's posts
        .then((user) => {
            user.comments.unshift(comment);
            user.save();
        })
        // Redirect to original Post
        .then(() => {
            res.redirect('/posts/' + req.params.postId);
        })
        .catch((err) => {
            console.log(err.message);
        });
});





};
