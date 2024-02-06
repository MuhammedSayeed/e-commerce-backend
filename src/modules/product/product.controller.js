import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { deleteOne } from "../handlers/factor.handler.js";
import { productModel } from '../../../databases/models/product.model.js'
import { ApiFeatures } from "../../utils/ApiFeature.js";

const createProduct = catchAsyncError(
    async (req, res, next) => {
        req.body.slug = slugify(req.body.title);
        req.body.imgCover = req.files.imgCover[0].filename;
        req.body.images = req.files.images.map(img => img.filename)
        
        let result = new productModel(req.body)
        await result.save();
        res.json({ message: "success", result })
    }
)
const updateProduct = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        if (req.body.title) req.body.slug = slugify(req.body.title);
        let results = await productModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!results) return next(new AppError(`product not found`, 404))
        res.json({ message: "success", results })
    }
)
const deleteProduct = deleteOne(productModel , 'product')
const getProduct = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        let result = await productModel.findById(id).populate(['category', 'subcategory'])
        if (!result) return next(new AppError(`product not found`, 404))
        res.json({ message: "success", result })
    }
)
const getProducts = catchAsyncError(
    async (req, res, next) => {
        let apiFeatures = new
            ApiFeatures(productModel.find(), req.query)
            .paginate()
            .filter()
            .fields()
            .sort()
            .search();
            console.log(apiFeatures.named)
        let results = await apiFeatures.mongooseQuery;
        res.json({
            message: "success",
            results: results
        })
    }
)
export {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
}


