import mongoose, { Schema } from 'mongoose';
import addressSchema from '../model/addressSchema.mjs'

const couponUsageSchema = mongoose.Schema({
  couponId:{
      type:mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      required:true
  },
  usageCount:{
      type:Number,
      default:0
  }
},{_id:false})

const userSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  username: {
    type: String,
    required: false, 
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Only require password if googleId is not present
    },
  },
  address:{
    type:[addressSchema],
    default:[]
}, 
favorites:{
  type:[Schema.Types.ObjectId],
  default:[]
},
  email: {
    type: String,
    required: true,
    unique: true, // Email should be unique
  },
  Phone: {
    type: [String],
  },
  is_blocked: { type: Boolean, default: false },
  is_varified: { type: Boolean, default: false }, // Consider renaming to 'is_verified'
  is_admin: { type: Number, default: 0 },
  googleId: { type: String },
 
},
{ timestamps: true } );

// Middleware to update 'updatedAt' before saving
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
