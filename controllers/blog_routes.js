const router = require('express').Router();
const Post = require('../models/Post');
const { authenticate, isAuthenticated } = require('../middleware/authenticate');

// Create a Blog Post
router.post('/create', isAuthenticated, authenticate, async (req, res) => {
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

// Find the post the user is updating and change it's text to the new text
router.put("/update", isAuthenticated, authenticate, async (req, res) => {
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
  
  router.get('/getPostId/:id', async (req, res) => {
    const postId = req.params.id;
  
    try {
      const post = await Post.findByPk(postId);
  
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
  
  router.delete("/delete/:id", async (req, res) => {
    const postId = req.params.id;
  
    try {
        const post = await Post.findByPk(postId);
  
        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }
  
        await post.destroy();
  
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;