import express from 'express';
import * as couponController from './coupon.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
const couponRouter = express.Router();

couponRouter.route('/')
    .post(protectedRoutes, allowedTo('admin' , 'user'), couponController.createCoupon)
    .get(couponController.getCoupons)

couponRouter.route('/:id')
    .get(couponController.getCoupon)
    .put(protectedRoutes, allowedTo('admin'), couponController.updateCoupon)
    .delete(protectedRoutes, allowedTo('admin'), couponController.deletedCoupon)
couponRouter.route('/apply')
    .post(protectedRoutes, allowedTo('user'), couponController.applyCoupon)
export default couponRouter