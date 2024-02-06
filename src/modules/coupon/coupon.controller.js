import { calcDisscount } from "../../utils/cartUtils.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { deleteOne } from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";
import { couponModel } from "../../../databases/models/coupon.model.js";
import qrcode from "qrcode";
import { cartModel } from "../../../databases/models/cart.model.js";


const createCoupon = catchAsyncError(
    async (req, res, next) => {
        let result = new couponModel(req.body)
        await result.save();
        res.json({ message: "success", result })
    }
)
const updateCoupon = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        let results = await couponModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!results) return next(new AppError(`coupon not found`, 404))
        res.json({ message: "success", results })
    }
)
const deletedCoupon = deleteOne(couponModel, 'coupon')
const getCoupon = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        let result = await couponModel.findById(id)
        let url = await qrcode.toDataURL(result.code)
        if (!result) return next(new AppError(`coupon not found`, 404))
        res.json({ message: "success", result, url })
    }
)
const getCoupons = catchAsyncError(
    async (req, res, next) => {
        let apiFeatures = new
            ApiFeatures(couponModel.find(), req.query)
            .paginate()
            .fields()
            .sort()
            .filter();
        let results = await apiFeatures.mongooseQuery;
        res.json({
            message: "success",
            page: apiFeatures.page,
            results
        })
    }
)
const applyCoupon = catchAsyncError(async (req, res, next) => {
    let coupon = await couponModel
        .findOne({ code: req.body.code, expires: { $gt: Date.now() } });
    if (!coupon) return next(new AppError(`Cannot find coupon or expired`, 404))
    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) return next(new AppError(`Cannot find this cart`), 404)
    
    calcDisscount(coupon.disscount, cart)
    cart.disscount = coupon.disscount;
    await cart.save();
    res.json({ message: "Success", cart: cart })
})
export {
    getCoupon,
    getCoupons,
    createCoupon,
    updateCoupon,
    deletedCoupon,
    applyCoupon
}


