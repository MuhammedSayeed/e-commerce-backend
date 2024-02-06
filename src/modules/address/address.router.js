import express from 'express';
import * as addressController from './address.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

const addressRouter = express.Router();

addressRouter.route('/add')
    .patch
    (
        protectedRoutes,
        allowedTo('user'),
        addressController.addAddress
    )
addressRouter.route('/remove')
    .patch
    (
        protectedRoutes,
        allowedTo('user'),
        addressController.removeAddress
    )
addressRouter.route('/')
    .get
    (
        protectedRoutes,
        allowedTo('user'),
        addressController.getUserAddresses
    )
export default addressRouter