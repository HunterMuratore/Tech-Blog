const router = require('express').Router();
const Post = require('../models/Post');
const { authenticate, isLoggedIn, isAuthenticated } = require('../middleware/authenticate');

// Create a Blog Post
router.post('/dashboard', isAuthenticated, authenticate, async (req, res) => {
    try {
        const newPost = await Post.create(req.body);

        // Add the Post to the user in the session
        await req.user.addPost(newPost);

        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        if (err.errors) {
            req.session.errors = err.errors.map(errObj => errObj.message);
        }
        res.redirect('/dashboard');
    }
});

module.exports = router;