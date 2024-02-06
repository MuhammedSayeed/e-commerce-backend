import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { userModel } from "../../../databases/models/user.model.js";

const addToWishlist = catchAsyncError(
    async (req, res, next) => {
        const {product} = req.body;
        let results = await userModel.findOneAndUpdate(req.user._id,{$addToSet : {wishlist : product}}, { new: true });
        if (!results) return next(new AppError(`user not found`, 404))
        res.json({ message: "success", wishlist : results.wishlist })
    }
)
const removeFromWishlist = catchAsyncError(
    async (req, res, next) => {
        const {product} = req.body;
        let results = await userModel.findOneAndUpdate(req.user._id,{$pull : {wishlist : product}}, { new: true });
        if (!results) return next(new AppError(`user not found`, 404))
        res.json({ message: "success", wishlist : results.wishlist })
    }
)
const getUserWishlist = catchAsyncError(
    async (req, res, next) => {
        let results = await userModel.findOne(req.user._id).populate('wishlist')
        if (!results) return next(new AppError(`user not found`, 404))
        res.json({ message: "success", wishlist : results.wishlist })
    }
)

export {
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,

}


