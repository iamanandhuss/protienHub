import mongoose from 'mongoose';

// Define the schema for the Banner model
const BannerSchema = new mongoose.Schema({
  // Unique identifier for the banner
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true, // Automatically generate an ObjectId
  },
  
  // Title of the banner
  banner_title: {
    type: String,
    required: false, // Not required
  },
  
  // Array of images for the banner
  banner_image: {
    type: [String], // Array of strings (image URLs or paths)
    required: false, // Not required
  },
  
  // Slug for the banner
  banner_slug: {
    type: String,
    required: false, // Not required
  },
  
  // Description of the banner
  banner_description: {
    type: String,
    required: false, // Not required
  },
  
  // Associated category
  associate_category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to another collection (e.g., categories)
    ref: 'Category', // Reference model name (adjust if needed)
    required: false, // Not required
  },
  
  // Status of the banner
  status: {
    type: String,
    required: false, // Not required
  },
  
  // Start date for the banner's display
  start_date: {
    type: Date,
    required: false, // Not required
  },
  
  // End date for the banner's display
  end_date: {
    type: Date,
    required: false, // Not required
  }
});

// Create the model using the schema
const Banner = mongoose.model('Banner', BannerSchema);

// Export the model
export default Banner;
