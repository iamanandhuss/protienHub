import mongoose from "mongoose";


const couponSchema = new mongoose.Schema(
    {
      code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      discountType: {
        type: String,
        enum: ["percentage", "fixed"], 
        required: true,
      },
      discountValue: {
        type: Number,
        required: true,
        min: 0,
      },
      maximumDiscount: {
        type: Number, 
        default: null,
      },
      usageLimit: {
        type: Number,
        default: 1,
      },
      usedCount: {
        type: Number,
        default: 0, 
      },
      applicableProducts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", 
        },
      ],
      validFrom: {
        type: Date,
        required: true,
      },
      validUntil: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["active", "expired", "disabled"],
        default: "active",
      },
    },
    {
      timestamps: true, 
    }
  );

  const Coupon=mongoose.model("Coupon",couponSchema)
  export default Coupon;