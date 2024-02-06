import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { cartModel } from "../../../databases/models/cart.model.js";
import { productModel } from "../../../databases/models/product.model.js";
import { calcDisscount, calcTotalPrice, findProductInCart } from "../../utils/cartUtils.js";


const addProductToCart = catchAsyncError(async (req, res, next) => {
    // check if product is valid or not
    let product = await productModel.findById(req.body.product);
    if (!product) {
        return next(new AppError(`product not found`, 404))
    }
    req.body.price = product.price;
    // check if user has cart or not
    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) {
        let cart = new cartModel({
            user: req.user._id,
            cartItems: [req.body],
        });
        calcTotalPrice(cart)
        await cart.save();
        return res.json({ message: "success", cart })
    }
    // searching for product in cart
    let item = findProductInCart(cart, req.body.product)
    if (item) {
        item.quantity += req.body.quantity || 1;
    } else {
        cart.cartItems.push(req.body)
    }
    calcTotalPrice(cart) //done
    if (cart.disscount) {
        calcDisscount(cart.disscount, cart)
    }
    await cart.save();
    res.json({ message: "success", cart: cart })
})
const removeProductFromCart = catchAsyncError(async (req, res, next) => {
    let user = req.user._id;
    let cart = await cartModel.
        findOneAndUpdate({ user: user }, { $pull: { cartItems: { product: req.body.product } } }, { new: true })

    calcTotalPrice(cart);
    if (cart.disscount) {
        calcDisscount(cart.disscount, cart);
    }

    if (!cart) return next(new AppError(`cart is not found`, 401));
    res.json({ message: "success", cart: cart })
})
const updateQTY = catchAsyncError(async (req, res, next) => {
    // check if product is valid or not
    let product = await productModel.findById(req.body.product);
    if (!product) return next(new AppError(`product not found to add`, 404))
    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) return next(new AppError(`cart is not found`), 404)
    // searching for product in cart
    let item = findProductInCart(cart, req.body.product)
    if (item) {
        item.quantity = req.body.quantity
    }
    calcTotalPrice(cart)
    if (cart.disscount) {
        calcDisscount(cart.disscount, cart)
    }
    await cart.save();
    res.json({ message: "success", cart: cart })
})
const getCart = catchAsyncError(async (req, res, next) => {
    let cart = await cartModel.findOne({ user: req.user._id })
        .populate('cartItems.product user')
    if (!cart) return next(new AppError(`Cart not found`, 404))
    res.json({ message: "success", cart: cart })
})
const clearCart = catchAsyncError(async (req, res, next) => {
    let cart = await cartModel.findOneAndDelete({ user: req.user._id })
    res.json({ message: "success" })
})


export {
    addProductToCart,
    removeProductFromCart,
    updateQTY,
    getCart,
    clearCart
}


