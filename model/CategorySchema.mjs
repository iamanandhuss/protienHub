import mongoose, { Schema } from 'mongoose';

const categorySchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  category_name: {
    type: String,
    required: true, 
  },
  category_slug: {
    type: String,
    required: false, 
  },
  description: {
    type: String,
    required: false, 
  },
  parent_category: {
    type: String,
    required: false, 
  },
  status: {
    type: String,
    required: false, 
  },
  category_image: {
    type: [String], 
    required: false, 
  },
  products: {
    type: [Schema.Types.ObjectId], 
    ref: 'Product',
    required: false, 
  },
  associate_category: {
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: false, 
  }
}, {
  timestamps: true, 
});

const categories = mongoose.model('categories', categorySchema);

export default categories;
