import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js";

export const deleteOne = (model , type) => {
    return catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        let result = await model.findByIdAndDelete(id);
        if (!result) return next(new AppError(`${type} not found`, 404));
        res.json({ message: "deleted successfully" });
    })
}