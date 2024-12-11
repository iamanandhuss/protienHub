import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import category from '../../model/CategorySchema.mjs'
import Product from '../../model/productSchema.mjs';
import Coupon from '../../model/couponSchema.mjs';


export const manage_coupons=async(req,res)=>{
    const user = await User.findOne({ email: req.session.adminEmail })
    const products = await Product.find()
    try {
     res.render("admin/createCoupon.ejs",{user,products})
    } catch (error) { 
       console.log(error); 
    }
}

export const addCoupons=async(req,res)=>{
    try {
        const coupon = await Coupon.findOne({ code: req.body.code.trim() });
        if (coupon) {
            return res.status(409).json({ message: "Coupon already exist" });
            }
        const newCoupon = new Coupon(req.body);
        await newCoupon.save();
        res.status(201).json({ message: "Coupon added successfully" });
        } catch (error) {
            console.log(error);
        } 
}

export const view_coupon_details=async(req,res)=>{
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = parseInt(req.query.limit) || 5; // Items per page, default is 10
    const skip = (page - 1) * limit;
    const totalCoupons = await Coupon.countDocuments()
    const totalPages = Math.ceil(totalCoupons / limit);


    const user = await User.findOne({ email: req.session.adminEmail })
    const coupon=await Coupon.find().populate({
        path:'applicableProducts',
        model:'Product',
        select:'product_image',
        options: { strictPopulate: false },
    }).skip(skip)
    .limit(limit);;
    try {
        res.render("admin/couponManage.ejs",{user,coupon,totalPages,
            currentPage: page,
            limit})
    } catch (error) {
        console.log(error);
    }
}