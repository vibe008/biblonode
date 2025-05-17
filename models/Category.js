const mongoose = require("mongoose")

const CatagorySchema = mongoose.Schema({
    name: {type:String , require:true , unique:true}
}) 

module.exports = mongoose.model("Category",CatagorySchema)