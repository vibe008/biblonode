const express = require("express");
const { searchposts } = require("../controllers/searchController");
const router = express.Router();

router.get("/search", searchposts)

module.exports = router;
