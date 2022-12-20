const path = require("path")

module.exports.fileExtLimiter = (allowedExtArray) =>{
    return (req,res,next) =>{
        const files = req.files;
        const files_extenstions = []
        Object.keys(files).forEach(key=>{
            files_extenstions.push(path.extname(files[key].name))
        })

        //check if the files uploaded are allowed
        const allowed = files_extenstions.every(ext => allowedExtArray.includes(ext))

        if(!allowed){
            return res.status(422).json({status: "error", message:`File extension is not accepted, send only ${allowedExtArray}`})
        }
        next()
    }
}