import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
   code : {
    type : String,
    trim : true ,
    required : [true , 'coupon code required'],
    unique : true
   },
   disscount : {
    type : Number,
    min : 0,
    required : [true , 'coupon disscount required'],
   },
   expires : {
    type : Date,
    required : [true , 'coupon date required'],
   }
},{
    timestamps : true
})

export const couponModel = mongoose.model('coupon' , couponSchema)