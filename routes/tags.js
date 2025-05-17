const express = require("express")
const router = express.Router()
const { createtag ,getAlltag ,editTag ,deletetag} = require("../controllers/tagcontroller")

router.post("/createtag" ,createtag)
router.get("/getAlltag" ,getAlltag)
router.put("/editTag/:id" ,editTag)
router.delete("/deletetag/:id" ,deletetag)

module.exports = router;
