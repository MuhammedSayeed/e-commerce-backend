import express from 'express';
import * as orderController from './order.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
const orderRouter = express.Router();


orderRouter.route('/create')
    .post(protectedRoutes, allowedTo('user'), orderController.createCashOrder)
orderRouter.route('/order')
    .get(protectedRoutes, allowedTo('user', 'admin'), orderController.getOrder)
orderRouter.route('/all')
    .get(protectedRoutes, allowedTo('admin'), orderController.getAllOrders)

export default orderRouter