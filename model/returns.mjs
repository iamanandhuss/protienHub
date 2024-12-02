import mongoose, { Schema } from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "userCredentials",
      required: false,
    },  
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: false,
        },
        order: {
          type: Schema.Types.ObjectId,
          ref: "Order",
          required: false,
        },
        quantity: {
          type: Number,
          required: false,
          min: 1,
        },
        amount: {
          type: Number,
          required: false,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: false,
      min: 0,
    },
    refundMode: {
      type: String,
      enum: ["wallet"],
      default: "wallet",
    },
    refundStatus: {
      type: String,
      enum: ["Refunded", "pending"],
      default: "pending",
    },
    reason: {
      type: String,
      enum: ["Damaged_upon_arrival", "Wrong_product", "Defective_Needed", "Change_of_mind"],
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Returns = mongoose.model("Returns", returnSchema);
export default Returns;
