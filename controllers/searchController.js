const Post = require("../models/Post");
const Category = require("../models/Category");
const Tag = require("../models/Tags");

exports.searchposts = async (req, res) => {
    const { query } = req.query;

    try {
        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Search query is required." });
        }

        const regex = new RegExp(query, "i");

        // 1. Find matching categories and tags by name
        const matchedCategories = await Category.find({ name: regex }).select('_id');
        const matchedTags = await Tag.find({ name: regex }).select('_id');

        const categoryIds = matchedCategories.map(cat => cat._id);
        const tagIds = matchedTags.map(tag => tag._id);

        const posts = await Post.find({
            $or: [
                { title: regex },
                { categories: { $in: categoryIds } },
                { tags: { $in: tagIds } },
            ],
        }).populate('tags').populate('categories'); 
        if(posts.length === 0) return res.status(400).json({message:"No post Found"})
        res.json(posts);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
