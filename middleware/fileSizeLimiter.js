const MB = 1
const FILE_SIZE_LIMIT = MB * 1024 * 1024

module.exports.fileSizeLimiter = (req,res,next) =>{
    const files = req.files
    // determine which files are over the limit
    const filesOverLimit = []
    Object.keys(files).forEach(key =>{
        if(files[key] > FILE_SIZE_LIMIT){
            filesOverLimit.push(files[key].name)
        }
    })

    if(filesOverLimit.length){
        return res.status(413).json({status: "error", message:"File is too large to upload"})
    }

    next()
}