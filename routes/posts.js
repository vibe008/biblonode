const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload  = require("../middlewares/multer")
const {
  createPost,getPostsByCategory,
  getPostByUserID,
  getPostBySlug
} = require('../controllers/postController');

router.post('/createPost', authMiddleware, upload.single('voice') , createPost);
router.get('/category/byname/:name', getPostsByCategory);
router.get('/findbyuser/:userId', getPostByUserID);
router.get('/story/:slug', getPostBySlug);


module.exports = router;