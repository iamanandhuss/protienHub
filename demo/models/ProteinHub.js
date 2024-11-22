import mongoose, { Schema } from 'mongoose';
const CategorySchema = new mongoose.Schema({
    categoryTitle: {
      type: String,
      required: true
    },
    products: [String] 
  });


const proteinHubContentSchema = new mongoose.Schema({
    sectionTitle: {
      type: String,
      required: true
    },
    sectionDescription: {
      type: String
    },
    sectionPoints: {
      type: [String] 
    },
    categories: [CategorySchema] 
  });
const ProteinHubContent = mongoose.model('ProteinHubContent', proteinHubContentSchema, 'proteinHubContentArray');

export default ProteinHubContent;