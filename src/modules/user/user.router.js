import express from 'express';
import * as userController from './user.controller.js'
const userRouter = express.Router();

userRouter.route('/')
    .post(userController.createUser)
    .get(userController.getAllUsers)

userRouter.route('/:id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser)

userRouter.route('/changeuserpassword/:id').patch(userController.changeUserPassword)

export default userRouter