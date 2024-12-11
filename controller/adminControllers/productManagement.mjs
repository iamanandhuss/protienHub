import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import category from '../../model/CategorySchema.mjs'
import Product from '../../model/productSchema.mjs';

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
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = parseInt(req.query.limit) || 6; // Items per page, default is 10
    const skip = (page - 1) * limit;

    const user = await User.findOne({ email: req.session.adminEmail });
      const totalProducts = await Product.countDocuments(); // Total number of products
      const totalPages = Math.ceil(totalProducts / limit);  // Calculate total pages

    const products = await Product.find()
      .skip(skip)
      .limit(limit);
 
    // Pass all necessary variables to the template
    res.render('admin/productList.ejs', {
      user,
      products,
      totalPages,
      currentPage: page, // Add currentPage here
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
        { folder: "products" }, // Specify folder if needed
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


export const createProduct = async (req, res) => {
  const product = await Product.find();
  const imageUrls = [];
  try {
    console.log(await uploadBase64ImageToCloudinary(req.body.croppedImage1));
    if (
      req.body.croppedImage1 &&
      req.body.croppedImage2 &&
      req.body.croppedImage3
    ) {
      imageUrls.push(
        await uploadBase64ImageToCloudinary(req.body.croppedImage1)
      );
      imageUrls.push(
        await uploadBase64ImageToCloudinary(req.body.croppedImage2)
      );
      imageUrls.push(
        await uploadBase64ImageToCloudinary(req.body.croppedImage3)
      );
    }
    const {
      product_name,
      product_slug,
      brand,
      price,
      stock_quantity,
      stock_status,
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
      nutrition_information={},
      status,
      categoryId,
      product_certifications,
      additional_information,
    } = req.body;

    const {
      calories_per_serving = 0, // Default value if not provided
      sugar_per_serving = 0,
      fat_per_serving = 0,
      carb_per_serving = 0
    } = nutrition_information;



    
    // Create a new product document using the Product model
    const newProduct = new Product({
      product_name,
      product_slug,
      brand,
      price,
      stock_quantity,
      stock_status,
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
      nutrition_information:{
        calories_per_serving, // Default value if not provided
        sugar_per_serving,
        fat_per_serving,
        carb_per_serving
      }, 
      categories: [categoryId],
      product_image: imageUrls,
      status,
      product_certifications,
      additional_information: { additional_information }
    });
    

    const savedProduct = await newProduct.save();
  res.status(201).json({
    message: "Product added successfully",
    product: savedProduct,
    success: true,
    url: "/admin/view_all_products" // URL for redirection
  });
} catch (error) {
  console.error("Error adding product:", error);
  res.status(500).json({
    error: "Server error, could not add product",
    success: false
  });
}
}

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
  try {
    const updatedProduct = await Product.findByIdAndUpdate(product_id, {
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