const express = require("express")
const router = express.Router()
const {getUserByID} = require("../controllers/userController")


router.get("/getPostUser/:id" ,getUserByID)


module.exports = router;
