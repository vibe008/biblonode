const Tag = require("../models/Tags")

exports.createtag = async (req, res) => {
    const { name } = req.body

    // console.log("name",name)
    try {
        const exextingtag = await Tag.findOne({ name: name })
        if (exextingtag) return res.status(400).json({ message: "Tag already exists" })

        const tag = await Tag.create({ name })
        return res.status(201).json({ message: "Tag Create Sucessfully", tag })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.getAlltag = async (req, res) => {
    try {
        const alltag = await Tag.find()
        if (alltag.length === 0) return res.status(400).json({ message: "No Tag Found" })
        return res.status(200).json(alltag)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// exports.editTag = async (req, res) => {
//     const { name } = req.body;
//     try {
//         const tag = await Tag.findById(req.params.id,
//             { name },
//             { new: true }
//         )
//         if (!tag) return res.status(400).json({ message: "No Tag Found" })
//         return res.status(200).json({ message: "Tag Update Sucessfully", tag })
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

exports.editTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({ message: "No Tag Found" });
    }

    res.status(200).json({ message: "Tag Update Sucessfully", tag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletetag = async (req,res) =>{
    try {
        const tag  = await Tag.findByIdAndDelete(req.params.id)
        if (!tag) return res.status(404).json({ message: "No Tag Found" })
            return res.status(200).json({message:"Tag Delete Sucessfully"})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

