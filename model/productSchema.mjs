import mongoose, { Schema } from "mongoose";


// Define the Product schema
const ProductSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_slug: { type: String, required: true,},
    sku: { type: String, required: true,},
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    sale_price: { type: Number },
    additional_discount: { type: Number },
    discount: { type: String },
    stock_quantity: { type: Number, required: true },
    expiry: { type: Date, required: true },
    mfg: { type: Date, required: true },
    Flavor: {type: [String]},
    countryof_origin: { type: String, required: true },
    dietary_choices: { type: String, required: true },
    material_compositions: { type: String },
    ean: { type: String, required: true },
    number_of_serving: { type: String, required: true },
    weight: { type: Number, required: true },
    serving_size: { type: Number, required: true },
    protein_per_serving: { type: Number, required: true },
    nutrition_information: {
        calories_per_serving: { type: Number, required: true }, // Adjusted key
        sugar_per_serving: { type: Number, required: true },
        fat_per_serving: { type: Number, required: true },
        carb_per_serving: { type: Number, required: true },
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], // Reference Tag model
    product_image: { type: [String] },
    product_rating: [{ 
        Rattings: {
            type: Schema.Types.ObjectId,
            ref: "Rattings",  
            required: false, 
          },
    }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    product_certifications: { type: [String] },
    additional_information: { 
        type: Map,
        of: String, 
    }
}, { timestamps: true });

// Create the Product model
const Product = mongoose.model('Product', ProductSchema, 'Products');

export default Product;

