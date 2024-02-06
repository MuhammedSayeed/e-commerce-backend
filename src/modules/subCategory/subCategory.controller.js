import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { subCategoryModel } from "../../../databases/models/subCategory.model.js";
import { deleteOne } from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";

const createSubCategory = catchAsyncError(
    async (req, res, next) => {
        req.body.slug = slugify(req.body.name)
        let result = new subCategoryModel(req.body)
        await result.save();
        res.json({ message: "success", result })
    }
)
const updateSubCategory = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        const { name, category } = req.body;
        let results = await subCategoryModel.findByIdAndUpdate(id, { name, category, slug: slugify(name) }, { new: true });
        if (!results) return next(new AppError(`subCategory not found`, 404))
        res.json({ message: "success", results })
    }
)
const deleteSubCategory = deleteOne(subCategoryModel , 'subCategory');
const getSubCategory = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        let result = await subCategoryModel.findById(id).populate('category')
        if (!result) return next(new AppError(`subCategory not found`, 404))
        res.json({ message: "success", result })
    }
)
const getAllSubCategories = catchAsyncError(
    async (req, res, next) => {
        let filter = {};
        if (req.params.categoryId) {
            filter = { category: req.params.categoryId }
        }
        let apiFeatures = new
            ApiFeatures(subCategoryModel.find(filter), req.query)
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
    getAllSubCategories,
    getSubCategory,
    updateSubCategory,
    createSubCategory,
    deleteSubCategory
}
