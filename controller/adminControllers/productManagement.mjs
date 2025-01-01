import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import category from '../../model/CategorySchema.mjs'
import Product from '../../model/productSchema.mjs';
import { Buffer } from "buffer";
import { upload } from '../../uploads/cloudinary.mjs'
import { v2 as cloudinary } from "cloudinary";






export const blockproduct = async (req, res) => {
  const ProductId = req.params.id;
  try {
    const product = await Product.findById({ _id: ProductId });
    product.status = 'active';
    await product.save();
    res.redirect('/admin/view_all_products')
  } catch (error) {
    console.log(error);
  }
}




export const unblockproduct = async (req, res) => {
  const ProductId = req.params.id;
  try {
    const product = await Product.findById({ _id: ProductId });
    product.status = 'inactive';
    await product.save();
    res.redirect('/admin/view_all_products')
  } catch (error) {
    console.log(error);
  }
}

//product list
export const productDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 6; 
    const skip = (page - 1) * limit;
    const user = await User.findOne({ email: req.session.adminEmail });
      const totalProducts = await Product.countDocuments(); 
      const totalPages = Math.ceil(totalProducts / limit);  

    const products = await Product.find()
      .skip(skip)
      .limit(limit);
 
    res.render('admin/productList.ejs', {
      user,
      products,
      totalPages,
      currentPage: page, 
      limit
    });
  } catch (error) {
    console.log(error);
  }
};


export const viewDetails = async (req, res) => {
  try {
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);
    const user = await User.findOne({ email: req.session.adminEmail })
    const productId = await Product.findById(req.params.id)
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.render('admin/productManage.ejs', { user, product })
  } catch (error) {
    console.log(error);
  }
}



export const addProduct = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.adminEmail })
    const categories = await category.find();
    res.render('admin/createProduct.ejs', { user, categories,product:"" })
  } catch (error) {
    console.log(error);
  }

};

// product routes
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

const reder=(req,res)=>{
  res.redirect('/admin/view_all_products')
}
// //////////////////////////////////////////////////////////////////////////////////////////////////
export const createProduct = async (req, res) => {
  try {
    // Validate required fields in req.body
    const {
      product_name, product_slug, brand, price, gst,
      stock_quantity, status, expiry, mfg, Flavor, countryof_origin,
      dietary_choices, material_compositions, ean, number_of_serving,
      weight, serving_size, protein_per_serving, calories_per_serving,
      sugar_per_serving, fat_per_serving, carb_per_serving, categoryId,
      product_certifications, additional_information, croppedImage1,
      croppedImage2, croppedImage3
    } = req.body;

    if (!product_name || !product_slug || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please check your input.",
      });
    }

    // Handle image uploads
    const imageUrls = [];
    try {
      if (croppedImage1) {
        imageUrls.push(await uploadBase64ImageToCloudinary(croppedImage1));
      }
      if (croppedImage2) {
        imageUrls.push(await uploadBase64ImageToCloudinary(croppedImage2));
      }
      if (croppedImage3) {
        imageUrls.push(await uploadBase64ImageToCloudinary(croppedImage3));
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload images. Please try again.",
        error: error.message,
      });
    }

    // Create a new product instance
    const newProduct = new Product({
      product_name,
      product_slug,
      brand,
      price,
      gst,
      stock_quantity,
      expiry,
      mfg,
      Flavor,
      countryof_origin,
      dietary_choices,
      material_compositions,
      ean,
      number_of_serving,
      weight,
      serving_size,
      protein_per_serving,
      nutrition_information: {
        calories_per_serving,
        sugar_per_serving,
        fat_per_serving,
        carb_per_serving,
      },
      categories: categoryId,
      product_image: imageUrls,
      status,
      product_certifications,
      additional_information,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();
    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the product.",
      error: error.message,
    });
  }
};
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
export const editProduct=async(req,res)=>{
  const productId = await Product.findById(req.params.id)
  const user = await User.findOne({ email: req.session.adminEmail })
  const categories = await category.find();
  const product = await Product.findById(productId)
  
  try {
    res.render('admin/editProduct.ejs',{user,product,categories})
  } catch (error) {
    console.log(error);
  }
} 
export const updateProduct = async (req, res) => {
  const {
    product_id,
  product_name,
  product_slug,
  brand,
  price,
  stock_quantity,
  stock_status,
  expiry,
  mfg,
  flavor,
  countryof_origin,
  dietary_choices
  }=req.body;
  console.log(req.body );

  try {
    const updatedProduct = await Product.findByIdAndUpdate(product_id, {
  product_name: stock_quantity < 5 ? product_name + '-low stock' : product_name,
  product_slug,
  brand,
  price,
  stock_quantity,
  stock_status,
  expiry,
  mfg,
  flavor,
  countryof_origin,
  dietary_choices})


  if (!updatedProduct) {
    return res.status(404).json({
      error: "Product not found",
      success: false 
    }); 
  }
  return res.status(200).json({
    msg:"Product Updated successfully",
    success:true
  })
} catch (error) {
  console.error("Error updating product:", error);
  res.status(500).json({
    error: "Server error, could not update product",
    success: false
  });
}
 
};

export const addQuantity=async(req,res)=>{
const {id,quantity}=req.body;
try {
    const product = await Product.findById({ _id: req.query.id});
    product.stock_quantity=Number(product.stock_quantity)+Number(quantity);
    await product.save();
    res.status(200).json({ success: true, message: 'Quantity updated successfully' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
}
}  



