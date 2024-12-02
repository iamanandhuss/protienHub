import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "userCredentials", 
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        product_image: {
          type: [String],
          required: false,
        },
        price: {
          type: Number,
          required: true,
        },
        orderStatus: {
          type: String,
          enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"], // Possible statuses for the order item
          default: "Pending",
        },
      },
    ],
    totalAmount: {
      type: Number,
    },
    couponCode: { type: String },
    couponDiscound: {
      type: Number, 
      required: false,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon'
  },
    paymentMode: {
      type: String,
      enum: ["upi", "cod", "Credit/Debit_Cards"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"], 
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    cancelReason: {
      type: String,
      required: false,
    },
    cancelDescription: {
      type: String,
      required: false,
    },
    shipping_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: false,
    },
    grandTottal: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);


const Order = mongoose.model("Order", orderSchema);
export default Order;
