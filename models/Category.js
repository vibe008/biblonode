const mongoose = require("mongoose")

const CatagorySchema = mongoose.Schema({
    name: { type: String, require: true, unique: true },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    }
})

module.exports = mongoose.model("Category", CatagorySchema)