const Comment = require('../models/comment');
const Post = require('../models/post')
const User = require('../models/user')


module.exports = (app) => {




	app.post('/posts/:postId/comments', (req, res) => {

		const comment = new Comment(req.body);
		comment.author = req.user._id;
        comment.postId = req.params.postId
		comment

			.save()

			.then(() => {
				return Post.findById(req.params.postId);

			})
			.then((post) => {
				post.comments.unshift(comment);
				post.save();
			})
			// Find the parent Pyromancer
			.then(() => {
				return User.findById(req.user._id);
			})
			// Find the author, save its posts
			.then((user) => {
				user.comments.unshift(comment);
				user.save();
			})
			// Redirect to original Flare
			.then(() => {
				res.redirect('/posts/' + req.params.postId);
			})
			.catch((err) => {
				console.log(err);
			});
	});












}
