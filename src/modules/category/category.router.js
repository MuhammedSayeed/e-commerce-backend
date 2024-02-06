import express from 'express';
import * as categoryControllers from './category.controller.js'
import subCategoryRouter from '../subCategory/subCategory.router.js'
import { validation } from '../../middleware/validation.js';
import { createCategorySchema, deleteCategorySchema, getCategorySchema, updateCategorySchema } from './category.validation.js';
import { uploadSingleFile } from '../../middleware/fileUpload.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
const categoryRouter = express.Router();

categoryRouter
    .use('/:categoryId/subcategories', subCategoryRouter)
categoryRouter.route('/')
    .post(protectedRoutes, allowedTo('admin', 'user'), uploadSingleFile('image', 'categories'), validation(createCategorySchema), categoryControllers.createCategory)
    .get(categoryControllers.getAllCategories)
categoryRouter.route('/:id')
    .get(validation(getCategorySchema), categoryControllers.getCategory)
    .delete(protectedRoutes, allowedTo('admin', 'user'), validation(deleteCategorySchema), categoryControllers.deleteCategory)
    .put(protectedRoutes, allowedTo('admin', 'user'), uploadSingleFile('image', 'categories'), validation(updateCategorySchema), categoryControllers.updateCategory)

export default categoryRouter