import mongoose, { Schema } from 'mongoose';

// Define the wish_list schema
const wishListSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'userCredentials',
        required: true // User reference is mandatory
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: 'products' // Reference to the products collection
    }],
    created_at: {
        type: Date,
        default: Date.now // Automatically set the creation date
    },
    updated_at: {
        type: Date,
        default: Date.now // Automatically set the update date
    }
});

// Update the updated_at field before saving the document
wishListSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

// Create the wish_list model
export const WishList = mongoose.model('WishList', wishListSchema);
