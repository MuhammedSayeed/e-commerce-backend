import express from 'express';
import * as authController from './auth.controller.js'
const authRouter = express.Router();

authRouter.route('/signup')
    .post(authController.signUp)

authRouter.route('/signin')
    .post(authController.signIn)

export default authRouter