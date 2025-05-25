const express = require("express")
const router = express.Router()
const {Createcatagory ,getAllCatagory ,editCatagory ,deleteCatagory}  = require("../controllers/catagoryController")

router.post("/createcatagory", Createcatagory)
router.get("/GetAllcatagory", getAllCatagory)
router.put("/editCatagory/:id", editCatagory); 

router.delete("/deleteCatagory/:id", deleteCatagory); 

module.exports = router;