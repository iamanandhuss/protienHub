import mongoose from 'mongoose';
import Product from '../model/productSchema.mjs';
import Category from '../model/CategorySchema.mjs';

const offerSchema = new mongoose.Schema(
    {
        offerName: {
            type: String,
            default: '',
            required: true,
            trim: true,
        },
        offerDescription: {
            type: String,
            default: '',
            trim: true,
        },
        offerPercentage: {
            type: Number,
            default: null,
            min: 0,
            max: 100,
        },
        offerType: {
            type: String,
            required: true,
            enum: ['category', 'product','all'], // Define acceptable values
        },
        associatedData: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
            validate: {
                validator: async function (associatedData) {
                    if (this.offerType === 'category') {
                        const docs = await Category.find({ _id: { $in: associatedData } });
                        return docs.length === associatedData.length;
                    }
                    if (this.offerType === 'product') {
                        const docs = await Product.find({ _id: { $in: associatedData } });
                        return docs.length === associatedData.length;
                    }
                    return true;
                },
                message: (props) => `Invalid associatedData for offerType: ${props.value}`,
            },
        },
    }, 
    {
        timestamps: true,
    }
);

const Offer=mongoose.model('Offer', offerSchema);
export default Offer;
