import mongoose, { Schema } from "mongoose";

// Define cartSchema
const cartSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user credentials collection
        required: true
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product', // Reference to the products collection
            required: true
        }, 
        quantity: {
            type: Number, 
            min: 1,
            max: 10, // Assuming a maximum quantity per product
            default: 1
        },
        price: {
            type: Number,
            required: true
        },
        discount: { type: Number, required: false },
        gst:{type:Number,required: false},
    }],
    withOutDis:{
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    }
});

// Calculate totalAmount 
cartSchema.pre('save', function(next) {
    this.totalAmount = this.products.reduce((total, product) => {
        return total + (((product.price * product.quantity)/100)*(100-product.discount)+((product.price/100)*product.gst));
    }, 0);
    next(); 
});
// withOutDis
cartSchema.pre('save', function(next) {
    this.withOutDis = this.products.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);
    next(); 
});

// Create cartModel
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
