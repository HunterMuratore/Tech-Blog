const router = require('express').Router();
const Post = require('../models/Post');
const { authenticate, isAuthenticated } = require('../middleware/authenticate');

// Find the post the user is updating and change it's text to the new text
router.post("/update", isAuthenticated, authenticate, async (req, res) => {
  const { postId, newText } = req.body;

  try {
    const post = await Post.update(
      { text: newText },
      { where: { id: postId } }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error("Error updating post text:", error);
    res.status(500).json({ error: "Error updating post text" });
  }
});

router.get('/getPostId', async (req, res) => {
  const postText = req.query.text;

  try {
    const post = await Post.findOne({
      where: { text: postText }
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.json({ postId: post.id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
