import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { orderModel } from "../../../databases/models/order.model.js";
import { cartModel } from "../../../databases/models/cart.model.js";
import { productModel } from "../../../databases/models/product.model.js";

const createCashOrder = catchAsyncError(async (req, res, next) => {
    // get the user's cart
    const cart = await cartModel.findOne({ _id: req.body.cart });
    if (!cart) return next(new AppError(`cart is not found`, 404));
    // calc total Price
    const totalOrderPrice = cart.totalPriceAfterDisscount ? cart.totalPriceAfterDisscount : cart.totalPrice;
    // create the order
    const order = new orderModel({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice: totalOrderPrice,
        shippingAddress: req.body.shippingAddress
    })
    await order.save();
    // decrment the quantity of products & increment the sold
    if (order) {
        let options = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: item.quantity } }
            }
        }))
        await productModel.bulkWrite(options)
        // clear user's cart
        await cartModel.findByIdAndDelete(req.params.id)
        res.json({ message: "order placed successfully", order })

    }
    else {
        return next(new AppError(`there's something wrond`, 404));
    }

})
const getOrder = catchAsyncError(async (req, res, next) => {
    let order = await orderModel.findOne({ user: req.user._id })
    if (!order) return next(new AppError(`order not found`, 404))
    res.json({ message: "success", result: order })

})
const getAllOrders = catchAsyncError(async (req, res, next) => {
    let orders = await orderModel.find({})
    res.json({ message: "success", result: orders })

})




export {
    createCashOrder,
    getOrder,
    getAllOrders
}


