import express from 'express';
import * as wishListController from './wishList.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

const wishListRouter = express.Router();

wishListRouter.route('/add')
    .patch
    (
        protectedRoutes,
        allowedTo('user'),
        wishListController.addToWishlist
    )
wishListRouter.route('/remove')
    .patch
    (
        protectedRoutes,
        allowedTo('user'),
        wishListController.removeFromWishlist
    )
wishListRouter.route('/')
    .get
    (
        protectedRoutes,
        allowedTo('user'),
        wishListController.getUserWishlist
    )
export default wishListRouter