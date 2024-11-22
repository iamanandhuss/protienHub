import mongoose, { Schema } from "mongoose";

// Define orderSchema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "userCredentials", // Reference to the userCredentials collection
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products", // Reference to the products collection
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Minimum quantity must be at least 1
        },
        price: {
          type: Number,
          required: true, // Price of the product at the time of order
        },
        orderStatus: {
          type: String,
          enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], // Possible statuses for the order item
          default: "Pending",
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true, // Total amount for the order
    },
    paymentMode: {
      type: String,
      enum: ["wallet", "upi", "cod"], // Accepted payment modes
      default: "cod", // Default payment mode
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"], // Possible payment statuses
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], // Overall order status
      default: "Pending",
    },
    shipping_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address', // Assuming there's an Address model
        required: false, // Nullable
      },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Create orderModel
export const Order = mongoose.model("Order", orderSchema);
