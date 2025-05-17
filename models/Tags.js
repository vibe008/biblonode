const mongoose = require("mongoose")

const TagsSchema = new mongoose.Schema({
    name: {type:String , require:true , unique:true}
})

module.exports = mongoose.model("Tags" ,TagsSchema)