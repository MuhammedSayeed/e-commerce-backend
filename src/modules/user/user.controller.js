import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { deleteOne } from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";
import { userModel } from "../../../databases/models/user.model.js";

const createUser = catchAsyncError(
    async (req, res, next) => {
        let user = await userModel.findOne({ email: req.body.email });
        if (user) return next(new AppError('account already exist', 409))
        let result = new userModel(req.body);
        await result.save();
        res.json({ message: "success", result })
    }
)
const updateUser = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        let results = await userModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!results) return next(new AppError(`user not found`, 404))
        res.json({ message: "success", results })
    }
)
const deleteUser = deleteOne(userModel , 'user')
const getUser = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params;
        let result = await userModel.findById(id)
        if (!result) return next(new AppError(`user not found`, 404))
        res.json({ message: "success", result })
    }
)
const getAllUsers = catchAsyncError(
    async (req, res, next) => {
        let apiFeatures = new
            ApiFeatures(userModel.find(), req.query)
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
const changeUserPassword = catchAsyncError(
    async (req, res, next) => {
        let { id } = req.params;
        let { password } = req.body;
        const passwordChangedAt = Date.now()
        let results = await userModel.findByIdAndUpdate(id, { password , passwordChangedAt }, { new: true });
        if (!results) return next(new AppError(`user not found`, 404))
        res.json({ message: "success" })
    }
)
export {
    createUser,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    changeUserPassword
}


