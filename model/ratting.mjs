import mongoose, { Schema } from "mongoose";

// Define rattingSchema
const rattingSchema = new mongoose.Schema({
    productID: {
        type: Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
    },  
    products: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User', 
                required: true
            },
            ratting: {
                type: Number, 
                min: 1,
                max: 5, 
                default: 0,
                required: true 
            },
            description: { 
                type: String, 
                required: false
            }
        }
    ]
});

rattingSchema.virtual('averageRatting').get(function () {
    if (!this.products || this.products.length === 0) {
        return 0;
    }
    const total = this.products.reduce((sum, item) => sum + item.ratting, 0);
    return (total / this.products.length).toFixed(2);
});

rattingSchema.set('toJSON', { virtuals: true });
rattingSchema.set('toObject', { virtuals: true });

const Rattings = mongoose.model('Rattings', rattingSchema);
export default Rattings;
