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
      isvarified: false
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getlatestpost = async (req, res) => {
  try {
    const posts = await Post.find().populate([
      { path: 'categories', select: 'name slug' },
      { path: 'tags', select: 'name slug' },
    ]);
    if (!posts) return res.status(400).json({ message: "No Latest Post Found" })
    res.status(200).json(posts)

    console.log("posts", posts)
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
}

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('categories tags');
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getpostbycatagoryslug = async (req, res) => {
  try {
    console.log("Slug received:", req.params.slug); 

    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const posts = await Post.find({ categories: category._id }).populate('categories tags');
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts by category", error });
  }
}

exports.getpostbytagslug = async (req, res) => {
  try {
    console.log("Slug received:", req.params.slug); // Debug line

    const tag = await Tags.findOne({ slug: req.params.slug });
    if (!tag) return res.status(404).json({ message: "tag not found" });

    const posts = await Post.find({ tags: tag._id }).populate('categories tags');
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts by category", error });
  }
}
exports.getpostbyuserID = async (req, res) => {
  try {

    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: "tag not found" });

    const posts = await Post.find({ userId: user._id }).populate('categories tags');
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts by category", error });
  }
}


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
    const post = await Post.find({ userId: user._id }).populate("categories tags");
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}