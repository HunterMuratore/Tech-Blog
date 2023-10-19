const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

/* / routes */

// Custom Middleware function to check if the user is already logged in
function isLoggedIn(req, res, next) {
    if (req.session.user_id) {
        return res.redirect('/');
    }

    next();
}

// Check that the user is authenticated or send them to the login page
function isAuthenticated(req, res, next) {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }

    next();
}

// Authenticate a user
async function authenticate(req, res, next) {
    const user_id = req.session.user_id;
    
    if (user_id) {
        // Access to the user id stored in the login route
        const user = await User.findByPk(user_id, {
            attributes: ['id', 'username']
        });

        req.user = user.get({ plain: true });
    }

    next();
}

// Root page to show all blog posts
router.get('/', authenticate, async (req, res) => {
    // Find all of the Posts
    const posts = await Post.findAll({
        include: {
            model: User,
            as: 'author'
        }
    });

    res.render('home', { 
        user: req.user,
        // Send back only the plain objects for the posts array
        posts: posts.map(p => p.get({ plain: true }))
    });
});

// Show the register form if the user is not logged in
router.get('/register', isLoggedIn, authenticate, (req, res) => {
    res.render('register', {
        // If there are any session errors from them trying to register then they will be sent through to this page for us to use
        errors: req.session.errors,
        user: req.user
    });

    // Clear the error array after you render them
    req.session.errors = [];
});

// Show the login form if the user is not logged in
router.get('/login', isLoggedIn, authenticate, (req, res) => {
    res.render('login', {
        errors: req.session.errors,
        user: req.user
    });

    req.session.errors = [];
});

// Show dashboard only if the user is authenticated
router.get('/dashboard', isAuthenticated, authenticate, async (req, res) => {    
    const user_id = req.session.user_id;
    // Find all of the Posts by the user
    const posts = await Post.findAll({
        where: {
            author_id: user_id
        },
        include: {
            model: User,
            as: 'author'
        }
    });
    
    res.render('dashboard', {
        user: req.user,
        posts: posts.map(p => p.get({ plain: true }))
    });

    req.session.errors = [];
});

// Export the router
module.exports = router;