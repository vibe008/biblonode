const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload  = require("../middlewares/multer")
const {
  createPost,getPostsByCategory,
  getPostByUserID,
  getPostBySlug,
  getlatestpost,
  getpostbycatagoryslug,
  getpostbytagslug
} = require('../controllers/postController');

router.post('/createPost', authMiddleware, upload.single('voice') , createPost);
router.get('/getlatestpost',  getlatestpost);
router.get('/category/byname/:name', getPostsByCategory);
router.get("/getbycatagoryslug/:slug", getpostbycatagoryslug); 
router.get("/getbytagslug/:slug", getpostbytagslug); 
router.get('/findbyuser/:userId', getPostByUserID);
router.get('/story/:slug', getPostBySlug);


module.exports = router;