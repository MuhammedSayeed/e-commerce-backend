import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'user name is required'],
        trim: true,
        required: true,
        minLength: [1, 'too short user name']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'email is required'],
        minLength: [1, 'too short email'],
        unique: [true, 'email is unique']
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'too short password'],
        maxLength: [32, 'too long password']
    },
    passwordChangedAt: {
        type: Date
    },
    phone: {
        type: String,
        required: [true, 'phone is required'],
    },
    profilePic: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    wishlist: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'product'}],
    addresses : [{
        city : String,
        street : String,
        phone : String,
    }]

}, {
    timestamps: true
})

userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, Number(process.env.ROUND))

})
userSchema.pre('findOneAndUpdate', async function (next) {
    if (this._update.password) {
        this._update.password = bcrypt.hashSync(this._update.password, Number(process.env.ROUND))
    }
})
export const userModel = mongoose.model('user', userSchema)

