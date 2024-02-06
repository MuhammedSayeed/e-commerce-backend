import mongoose from "mongoose";
const productSchema = mongoose.Schema({
    title: {
        type: String,
        unique: [true, 'product title must be unique'],
        trim: true,
        required: [true, 'product title is required'],
        minLength: [2, 'too short product name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    price: {
        type: Number,
        required: [true, 'product price is required'],
        min: 0
    },
    priceAfterDiscount: {
        type: Number,
        min: [1, 'rating average must be greater than 1'],
        max: [5, 'rating average must be less than or equal 5'],
    },
    ratingCount: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        minLength: [5, 'too short description description'],
        maxLength: [300, 'too long description description'],
        required: [true, 'description description is required'],
        trim: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0,
        required: [true, 'product quantity is required'],
    },
    sold: {
        type: Number,
        default: 0,
        min: 0
    },
    imgCover: {
        type: String
    },
    images: [String],
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: [true, 'category is required']
    },
    subcategory: {
        type: mongoose.Types.ObjectId,
        ref: 'subcategory',
        required: [true, 'subCategory is required']
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'brand',
        required: [true, 'brand is required']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})

productSchema.virtual('reviews', {
    ref: 'review',
    localField: '_id',
    foreignField: 'product'
})
productSchema.pre(/^find/, function () {
    this.populate('reviews');
});

export const productModel = mongoose.model('product', productSchema)