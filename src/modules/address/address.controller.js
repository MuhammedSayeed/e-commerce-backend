import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { userModel } from "../../../databases/models/user.model.js";

const addAddress = catchAsyncError(
    async (req, res, next) => {
        let result = await userModel.findOneAndUpdate(req.user._id, { $push: { addresses: req.body } }, { new: true });
        if (!result) return next(new AppError(`user not found`, 404))
        res.json({ message: "success", result: result.addresses })
    }
)
const removeAddress = catchAsyncError(
    async (req, res, next) => {
        let result = await userModel.findOneAndUpdate(req.user._id, { $pull: { addresses: { _id: req.body.address } } }, { new: true });
        if (!result) return next(new AppError(`user not found`, 404))
        res.json({ message: "success", result: result.addresses })
    }
)
const getUserAddresses = catchAsyncError(
    async (req, res, next) => {
        let result = await userModel.findOne(req.user._id)
        if (!result) return next(new AppError(`user not found`, 404))
        res.json({ message: "success", result: result.addresses })
    }
)

export {
    addAddress,
    removeAddress,
    getUserAddresses,
}


