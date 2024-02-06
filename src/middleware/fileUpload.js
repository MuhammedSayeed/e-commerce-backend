import multer from "multer"
import { AppError } from "../utils/AppError.js"

let options = (folderName) => {
    function fileFilter(req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            return cb(null, true)
        }
        cb(new AppError('images only', 400), false)
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${folderName}`)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + "-" + file.originalname)
        }
    })
    return multer({ storage, fileFilter })

}

export const uploadSingleFile = (filedName, folderName) => {
    return options(folderName).single(filedName)
}
export const uploadMixOfFiles = (arrayOfFields, folderName) => {
    return options(folderName).fields(arrayOfFields)
}