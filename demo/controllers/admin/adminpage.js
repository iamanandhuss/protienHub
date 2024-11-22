import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
import user from '../../models/user/userSchema.js'
import Product from '../../models/productSchema.js';
import category from '../../models/CategorySchema.js';



export const dashboard = async (req, res) => {
    res.render('admin/dashboard.ejs')
}


export const allProducts = async (req, res) => {
    const products = await Product.find()

    res.render('admin/productList.ejs', { products })
}


export const orderList = async (req, res) => {
    const products = await Product.find()

    res.render('admin/orderList.ejs', {  })
}

export const productDetails = async (req, res) => {
    try {
    const ProductId=req.params.id;
    const product = await Product.find({_id:ProductId})
    const nutr_inf = product.nutrition_information;  
      console.log(nutr_inf);
    res.render('admin/productManage.ejs', { product })
    res.send("hao")
    } catch (error) {
        
    }
    
}

export const add_products = async (req, res) => {
  
}


export const view_banner = async (req, res) => {
    const products = await Product.find()

    res.render('admin/bannerList.ejs', {  })
}

export const view_categories = async (req, res) => {
    const products = await Product.find();
        const item = await category.find().sort({_id:1});
        const categories = item.map((item, index) => ({
            serialNumber: "#"+(index+200 + 1), // Serial number starting from 1
            ...item.toObject(), // Convert Mongoose document to plain object
          }));
        const users = await user.find();
    res.render('admin/categoryList.ejs', { users,categories })
}

export const view_coupons = async (req, res) => {
    const products = await Product.find()
    

    res.render('admin/couponList.ejs', {  })
}

export const view_users = async (req, res) => {
    const products = await Product.find()
    
    
   
    const item = await user.find().sort({ _id: 1 });

    // Map through the items to add a serial number
    const Users = item.map((item, index) => ({
      serialNumber: "#"+(index+99 + 1), // Serial number starting from 1
      ...item.toObject(), // Convert Mongoose document to plain object
    }));
    res.render('admin/userManage.ejs', { Users })
}