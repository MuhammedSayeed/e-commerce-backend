import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { brandModel } from "../../../databases/models/brand.model.js";
import { deleteOne } from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";

const createBrand = catchAsyncError(
    async (req, res, next) => {
        const { name } = req.body;
        req.body.slug = slugify(name);
        req.body.logo = req.file.filename;
        let result = new brandModel(req.body)
        await result.save();
        res.json({ message: "success", result })
    }
)
const updateBrand = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        const { name, category } = req.body;
        let results = await brandModel.findByIdAndUpdate(id, { name, category, slug: slugify(name) }, { new: true });
        if (!results) return next(new AppError(`subCategory not found`, 404))
        res.json({ message: "success", results })
    }
)
const deletedBrand = deleteOne(brandModel , 'brand')
const getBrand = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        let result = await brandModel.findById(id).populate('category')
        if (!result) return next(new AppError(`subCategory not found`, 404))
        res.json({ message: "success", result })
    }
)
const getBrands = catchAsyncError(
    async (req, res, next) => {
        let apiFeatures = new
            ApiFeatures(brandModel.find(), req.query)
            .paginate()
            .fields()
            .sort()
            .search()
            .filter();
        let results = await apiFeatures.mongooseQuery;
        res.json({
            message: "success",
            page: apiFeatures.page,
            results
        })
    }
)
export {
    getBrand,
    getBrands,
    createBrand,
    updateBrand,
    deletedBrand
}


