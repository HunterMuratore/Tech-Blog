const router = require('express').Router();
const Post = require('../models/Post');
const { authenticate, isLoggedIn, isAuthenticated } = require('../middleware/authenticate');

// Find the post the user is updating and change it's text to the new text
router.post("/update", isAuthenticated, authenticate, async (req, res) => {
    const { postId, newText } = req.body;
  
    try {
      const post = await Post.findByPk(postId);
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      post.text = newText;
      await post.save();
  
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating post text:", error);
      res.status(500).json({ error: "Error updating post text" });
    }
  });

module.exports = router;
