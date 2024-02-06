import express from 'express';
import * as subCategoryControllers from './subCategory.controller.js'
import { validation } from '../../middleware/validation.js';
import { createSubCategorySchema, deleteSubCategorySchema, getSubCategorySchema, updateSubCategorySchema } from './subCategory.validation.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter.route('/')
    .post(protectedRoutes, allowedTo('admin', 'user'), validation(createSubCategorySchema), subCategoryControllers.createSubCategory)
    .get(subCategoryControllers.getAllSubCategories)

subCategoryRouter.route('/:id')
    .get(validation(getSubCategorySchema), subCategoryControllers.getSubCategory)
    .put(protectedRoutes, allowedTo('admin', 'user'), validation(updateSubCategorySchema), subCategoryControllers.updateSubCategory)
    .delete(protectedRoutes, allowedTo('admin', 'user'), validation(deleteSubCategorySchema), subCategoryControllers.deleteSubCategory)

export default subCategoryRouter