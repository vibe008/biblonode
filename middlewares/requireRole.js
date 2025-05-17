module.exports = (requireRole)=>{
    console.log("requireRole",requireRole)
    return (req,res,next) =>{
        if(!req.user || req.user.role !== requireRole){
            return res.status(403).json({ message: "Forbidden: Insufficient privileges" });
        }
        next();
    }
}