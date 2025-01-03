import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true, 
  },
    
  bannerName: {
    type: [String], 
    required: false, 
  },
   
  bannerDescription: {
    type: String,
    required: false,
  },
  bannerImage: { type: [String], required: true },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
});

const Banner = mongoose.model('Banner', BannerSchema);

export default Banner;
