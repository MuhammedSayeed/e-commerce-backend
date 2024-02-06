import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { userModel } from "../../../databases/models/user.model.js";

const signUp = catchAsyncError(
    async (req, res, next) => {
        let checkExist = await userModel.findOne({ email: req.body.email });
        if (checkExist) return next(new AppError(`user already exist`, 409))
        let user = new userModel(req.body)
        await user.save();
        res.json({ message: "success", user })
    }
)
const signIn = catchAsyncError(
    async (req, res, next) => {
        const { email, password } = req.body;
        let isFound = await userModel.findOne({ email });
        if (!isFound) return next(new AppError(`user not found`, 404));
        const match = await bcrypt.compare(password, isFound.password);
        if (!match) return next(new AppError(`incorrect email or password`, 401))
        let token = jwt.sign({ name: isFound.name, userId: isFound._id, role: isFound.role }, process.env.JWT_KEY)
        res.json({ message: "success", token })
    }
)
const protectedRoutes = catchAsyncError(async (req, res, next) => {
    let { token } = req.headers;
    if (!token) return next(new AppError(`token is not provided`, 401));
    let decoded = jwt.verify(token, process.env.JWT_KEY)
    let user = await userModel.findById(decoded.userId);
    if (!user) return next(new AppError(`invalid token`, 404))
    // check if the user has changed his password before
    if (user.passwordChangedAt) {
        let changePasswordDate = parseInt(user.passwordChangedAt.getTime() / 1000);
        // comparing the token's time with the changePasswordDate
        if (changePasswordDate > decoded.iat) return next(new AppError(`invalid token`, 404))
    }
    console.log(user)
    req.user = user
    next()
})
const allowedTo = (...roles) => {
    return catchAsyncError(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(`you are not authorized to access this route. you are ${req.user.role}`, 401))
        }
        next()
    })
}
export {
    signUp,
    signIn,
    protectedRoutes,
    allowedTo
}


