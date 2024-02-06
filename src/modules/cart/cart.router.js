import express from 'express';
import * as cartController from './cart.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
const cartRouter = express.Router();

cartRouter.route('/')
    .get(protectedRoutes, allowedTo('user', 'admin'), cartController.getCart)
cartRouter.route('/add')
    .post(protectedRoutes, allowedTo('user'), cartController.addProductToCart)
cartRouter.route('/remove')
    .delete(protectedRoutes, allowedTo('user'), cartController.removeProductFromCart)
cartRouter.route('/update')
    .put(protectedRoutes, allowedTo('user'), cartController.updateQTY)
cartRouter.route('/clear')
    .delete(protectedRoutes, allowedTo('user'), cartController.clearCart)

export default cartRouter