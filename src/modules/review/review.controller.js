import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { deleteOne } from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";
import { reviewModel } from "../../../databases/models/review.model.js";

const createReview = catchAsyncError(
    async (req, res, next) => {
        req.body.user = req.user._id;
        let check = await reviewModel.findOne({ product: req.body.product, user: req.user._id });
        if (check) {
            return next(new AppError('you have created a review before', 409))
        }
        let review = new reviewModel(req.body)
        await review.save();
        res.json({ message: "success", review })
    }
)
const updateReview = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        let results = await reviewModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (!results) return next(new AppError(`review not found`, 404))
        res.json({ message: "success", results })
    }
)
const deletedReview = deleteOne(reviewModel , 'review')
const getReview = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        let result = await reviewModel.findById(id)
        if (!result) return next(new AppError(`review not found`, 404))
        res.json({ message: "success", result })
    }
)
const getReviews = catchAsyncError(
    async (req, res, next) => {
        let filter = {};
        if (req.query.product) {
            filter = { product: req.query.product }
        }
        let apiFeatures = new
            ApiFeatures(reviewModel.find(filter), req.query)
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
    getReview,
    getReviews,
    createReview,
    updateReview,
    deletedReview
}


