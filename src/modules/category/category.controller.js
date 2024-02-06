import { categoryModel } from "../../../databases/models/category.model.js"
import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { deleteOne } from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";





const createCategory = catchAsyncError(
    async (req, res, next) => {
        const { name } = req.body;
        req.body.slug = slugify(name)
        req.body.image = req.file.filename;
        let result = new categoryModel(req.body)
        await result.save();
        res.json({ message: "success", result })
    }
)
const updateCategory = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        const { name } = req.body;
        let results = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        if (!results) return next(new AppError(`category not found`, 404))
        res.json({ message: "success", results })
    }
)
const deleteCategory = deleteOne(categoryModel , 'category');
const getCategory = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        let result = await categoryModel.findById(id);
        if (!result) return next(new AppError(`category not found`, 404))
        res.json({ message: "success", result })
    }
)
const getAllCategories = catchAsyncError(
    async (req, res, next) => {
        let apiFeatures = new
            ApiFeatures(categoryModel.find(), req.query)
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
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategory
}
