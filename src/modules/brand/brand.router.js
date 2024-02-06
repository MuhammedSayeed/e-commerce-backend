import express from 'express';
import * as brandController from './brand.controller.js'
import { createBrandSchema } from './brand.validation.js';
import { validation } from '../../middleware/validation.js';
import { uploadSingleFile } from '../../middleware/fileUpload.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
const brandRouter = express.Router();

brandRouter.route('/')
    .post(protectedRoutes, allowedTo('admin', 'user'), uploadSingleFile('logo', 'brands'), validation(createBrandSchema), brandController.createBrand)
    .get(brandController.getBrands)

brandRouter.route('/:id')
    .get(brandController.getBrand)
    .put(protectedRoutes, allowedTo('admin', 'user'), brandController.updateBrand)
    .delete(protectedRoutes, allowedTo('admin', 'user'), brandController.deletedBrand)

export default brandRouter