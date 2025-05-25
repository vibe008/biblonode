const Category = require("../models/Category");
const slugify = require('slugify');
// Create a new category
exports.Createcatagory = async (req, res) => {
  try {
    const { name } = req.body;
          
    // Optional: check for duplicate
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name ,
      slug: slugify(name)
    });

    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories
exports.getAllCatagory = async (req, res) => {
  try {
    const allCategories = await Category.find();

    // No need for `!allCategories` — an empty array is still valid
    if (allCategories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    res.status(200).json(allCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.editCatagory = async (req, res) => {
  try {
    const { name } = req.body;
    const catagory = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!catagory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", catagory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteCatagory = async (req, res) => {
  try {
    const catagory = await Category.findByIdAndDelete(req.params.id);

    if (!catagory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
