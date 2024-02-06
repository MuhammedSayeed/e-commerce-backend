import express from 'express';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import * as reviewController from './review.controller.js'

const reviewRouter = express.Router();

reviewRouter.route('/')
    .post(protectedRoutes, allowedTo('user'), reviewController.createReview)
    .get(reviewController.getReviews)

reviewRouter.route('/:id')
    .get(reviewController.getReview)
    .put(protectedRoutes, allowedTo('admin', 'user'), reviewController.updateReview)
    .delete(protectedRoutes, allowedTo('admin', 'user'), reviewController.deletedReview)

export default reviewRouter