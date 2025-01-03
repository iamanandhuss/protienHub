import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import category from '../../model/CategorySchema.mjs'
import Product from '../../model/productSchema.mjs';
import Banner from '../../model/banner.mjs';
import { Buffer } from "buffer";
import { upload } from '../../uploads/cloudinary.mjs'
import { v2 as cloudinary } from "cloudinary";


const uploadBase64ImageToCloudinary = async (base64Data) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Data,
        { folder: "products" }, 
        (error, result) => {
          if (error) return reject(error);
          return resolve(result.secure_url);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
  
};


export const view_banner=async(req,res)=>{
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 8; 
  const skip = (page - 1) * limit;

  const inactiveBanner = await Banner.find({ status: 'inactive' }).countDocuments();
  const totalPages = Math.ceil(inactiveBanner / limit);  
 


    const user = await User.findOne({ email: req.session.adminEmail })
    const banners = await Banner.find({ status: 'inactive' }).skip(skip)
    .limit(limit);; 
    const activeBanners=await Banner.find({ status: 'active' });
    try {
        res.render("admin/bannerList.ejs", { user,banners,activeBanners,totalPages,
          currentPage: page, 
          limit })
    } catch (error) {
      console.log(error);  
    }
}
 

export const uploadBanner = async (req, res) => {
  try {
    const { bannerName, bannerDescription, croppedImage1 } = req.body;

    if (!bannerName || !bannerDescription || !croppedImage1) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please check your input.",
      });
    }

    const checkExist = await Banner.findOne({ bannerName });
    if (checkExist) {
      return res.status(409).json({ 
        success: false,
        message: "Banner with this name already exists.",
      });
    }

    const imageUrls = [];

    if (croppedImage1) {
      try {
        const uploadedImage = await uploadBase64ImageToCloudinary(croppedImage1);
        imageUrls.push(uploadedImage);
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary. Please try again later.",
          error: error.message,
        });
      }
    }

    const newBanner = new Banner({
      bannerName,
      bannerDescription,
      bannerImage: imageUrls,
    });

    const savedBanner = await newBanner.save();

    return res.status(200).json({
      success: true,
      message: "Banner uploaded successfully",
      banner: savedBanner,
    });

  } catch (error) {
    console.error('Error during banner upload:', error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
};


export const changeBanner= async(req,res)=>{
  const { selectId, changeId } = req.query;

  if (!selectId || !changeId) {
    return res.status(400).json({
      success: false,
      message: "Both 'selectId' and 'changeId' are required.",
    });
  }
  try {
    const updateSelectBanner = await Banner.findByIdAndUpdate(selectId, {
      status: 'active',
    }, { new: true });

    const updateChangeBanner = await Banner.findByIdAndUpdate(changeId, {
      status: 'inactive',
    }, { new: true }); 

    if (!updateSelectBanner || !updateChangeBanner) {
      return res.status(404).json({
        success: false,
        message: "One or both banners not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Banners updated successfully.",
      updatedBanners: {
        selectBanner: updateSelectBanner,
        changeBanner: updateChangeBanner,
      },
    });
  } catch (error) {
    console.error("Error updating banners:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update banners.",
      error: error.message,
    });
  }
}
