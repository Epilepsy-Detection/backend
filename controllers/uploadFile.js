const path = require("path")

module.exports.uploadfile = async (req,res,next) => {
    const files = req.files;

    Object.keys(files).forEach(key =>{
       const filepath = path.join('./',__dirname,'..', 'files', files[key].name)
       files[key].mv(filepath, (err) =>{
        if (err){
            return res.status(500).json({status:"error",message:err})
        }

       })

    })
    res.status(200).json({ status: 'upload success', message: Object.keys(files).toString() });
    
}