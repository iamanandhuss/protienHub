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
        discount: { type: Number, required: false },
        gst:{type:Number,required: false},
        orderStatus: {
          type: String,
          enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned","Refunded"], // Possible statuses for the order item
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
      enum: ["Razorpay", "cod", "wallet"],
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
    delivaryCharged:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

// Calculate totalAmount 
orderSchema.pre('save', function(next) {
  if(!this.delivaryCharged){
    this.grandTottal =this.totalAmount+50;
    next();
    this.delivaryCharged=true;
  }else{
    next();
  }
  
});


const Order = mongoose.model("Order", orderSchema);
export default Order;
