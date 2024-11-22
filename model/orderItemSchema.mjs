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
           required:false,
          },
        price: {
          type: Number, 
          required: true, 
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
      required: true, 
    },
    paymentMode: {
      type: String,
      enum: ["upi", "cod","Credit/Debit_Cards"],
      default: "cod",  
    }, 
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"], // Possible payment statuses
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
        ref: 'Address', 
        required: false, 
      },
  },
  {
    timestamps: true, 
  }
);


// Create orderModel
 const Order = mongoose.model("Order", orderSchema);
 export default Order;
 