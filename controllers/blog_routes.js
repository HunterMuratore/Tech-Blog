const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

/* /post routes */

// Can export this in a separate file and use where needed
function isAuthenticated(req, res, next) {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }

    next();
}

// Can export this in a separate file and use where needed
async function authenticate(req, res, next) {
    const user_id = req.session.user_id;
    
    if (user_id) {
        const user = await User.findByPk(user_id);

        req.user = user;
    }

    next();
}

// Create a Post
router.post('/dashboard', isAuthenticated, authenticate, async (req, res) => {
    try {
        const post = await Post.create(req.body);

        // Add the Post to the user in the session
        await req.user.addPost(post);

        res.redirect('/dashboard');
    } catch (err) {
        req.session.errors = err.errors.map(errObj => errObj.message);
        res.redirect('/dashboard');
    }
});

module.exports = router;