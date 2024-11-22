import mongoose, { Schema } from 'mongoose';

// Define the schema for the Coupons
const couponSchema = new mongoose.Schema({
    discount: {
        type: Number, // Using Number type for integers
        required: false // Optional field
    },
    coupon_name: {
        type: String,
        required: false // Optional field
    },
    coupon_code: {
        type: String,
        required: false // Optional field
    },
    coupon_type: {
        type: String,
        required: false // Optional field
    },
    coupon_description: {
        type: String,
        required: false // Optional field
    },
    start_date: {
        type: Date,
        required: false // Optional field
    },
    end_date: {
        type: Date,
        required: false // Optional field
    },
    status: {
        type: String,
        required: false // Optional field
    },
    associate_category: {
        type: mongoose.Schema.Types.ObjectId, // Reference to a Category
        ref: 'Category', // Reference to the Category model
        required: true // Required field
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the model from the schema
const Coupon = mongoose.model('Coupon', couponSchema);

// Export the model
export default Coupon;
