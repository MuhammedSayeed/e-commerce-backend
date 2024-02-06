import Joi from "joi";

export const createProductSchema = Joi.object({
    title : Joi.string().min(2).required(),
    price : Joi.number().required(),
    description : Joi.string().min(5).max(300).required(),
    quantity : Joi.number().min(0).required(),
    imgCover : Joi.string().required(),
    images : Joi.array().items(Joi.string()).min(1).required(),
    category : Joi.string().hex().length(24).required(),
    subcategory : Joi.string().hex().length(24).required(),
    brand : Joi.string().hex().length(24).required(),
})