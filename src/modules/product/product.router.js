import express from 'express';
import * as productController from './product.controller.js'
import { uploadMixOfFiles } from '../../middleware/fileUpload.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

const productRouter = express.Router();

let fieldsArray = [{ name: 'imgCover', maxCount: 1 }, { name: 'images', maxCount: 10 }]
productRouter.route('/')
    .post(protectedRoutes, allowedTo('admin', 'user'), uploadMixOfFiles(fieldsArray, 'products'), productController.createProduct)
    .get(productController.getProducts)

productRouter.route('/:id')
    .get(productController.getProduct)
    .put(protectedRoutes, allowedTo('admin', 'user'), productController.updateProduct)
    .delete(protectedRoutes, allowedTo('admin', 'user'), productController.deleteProduct)

export default productRouter