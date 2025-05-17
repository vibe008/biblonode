const Post = require("../models/Post");
const Category = require("../models/Category");
const User = require("../models/User");
const Tags = require("../models/Tags");
const { default: slugify } = require("slugify");

exports.createPost = async (req, res) => {
  try {

    const {
      title,
      story,
      likes = 0,
      comments = [],
      metaTitle,
      metaDescription,
    } = req.body;

    const categories = JSON.parse(req.body.categories || "[]");
    const tags = JSON.parse(req.body.tags || "[]");

    const categoryIds = categories.map(cat => cat.value); 
    const tagIds = tags.map(tag => tag.value);         

    // const categories = JSON.parse(req.body.categories || "[]");
    // const tags = JSON.parse(req.body.tags || "[]");

    // const categoryDocs = await Category.find({ name: { $in: categories } });
    // const categoryIds = categoryDocs.map(cat => cat._id);

    // const tagDocs = await Tags.find({ name: { $in: tags } });
    // const tagIds = tagDocs.map(tag => tag._id);


    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const slug = slugify(title, { lower: true, strict: true });
    const canonicalUrl = `http://localhost:3000/story/${slug}`;

    const post = await Post.create({
      userId: req.user.id,
      title,
      author: user.username,
      slug,
      canonicalUrl,
      metaTitle: metaTitle || title,
      story,
      likes,
      comments,
      metaDescription,
      categories: categoryIds,
      tags: tagIds,
      voiceurl: req.file ? req.file.path : null,
      isvarified:false
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};



exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.name;
    console.log("categoryname", categoryName)
    const category = await Category.findOne({ name: categoryName });
    console.log("category", category)
    if (!category) return res.status(404).json({ message: "Category not found" });
    const posts = await Post.find({ categories: category._id }).populate('categories');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostByUserID = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    console.log("user", user)
    if (!user) return res.status(404).json({ message: "User not found" })
    const post = await Post.find({ userId: user._id }).populate("categories");
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}