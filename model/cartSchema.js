import mongoose, { Schema } from "mongoose";

function calculateTotalAmount(products) {
    return products.reduce((total, product) => {
        const price = product.price || 0;
        const quantity = product.quantity || 0;
        const discount = product.discount || 0;
        return total + (((price * quantity) / 100) * (100 - discount));
    }, 0);
}

function calculateWithOutDis(products) {
    return products.reduce((total, product) => {
        const price = product.price || 0;
        const quantity = product.quantity || 0;
        return total + (price * quantity);
    }, 0);
}

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

// Pre-Save Hook
cartSchema.pre('save', function (next) {
    if (this.products) {
        this.totalAmount = calculateTotalAmount(this.products);
        this.withOutDis = calculateWithOutDis(this.products);
    }
    next();
});

// Pre-Update Hooks (updateOne, updateMany, findOneAndUpdate)
cartSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], async function (next) {
    const update = this.getUpdate();

    if (update.products) {
        update.totalAmount = calculateTotalAmount(update.products);
        update.withOutDis = calculateWithOutDis(update.products);
        this.setUpdate(update);
    }

    next();
});


// Create cartModel
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
