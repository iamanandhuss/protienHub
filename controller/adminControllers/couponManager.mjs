import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import category from '../../model/CategorySchema.mjs'
import Product from '../../model/productSchema.mjs';
import Coupon from '../../model/couponSchema.mjs';


export const manage_coupons = async (req, res) => {
    const user = await User.findOne({ email: req.session.adminEmail })
    const products = await Product.find()
    try {
        res.render("admin/createCoupon.ejs", { user, products })
    } catch (error) {
        console.log(error);
    }
}

export const addCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ code: req.body.code.trim() });
        if (coupon) {
            return res.status(409).json({ message: "Coupon already exist" });
        }
        const newCoupon = new Coupon(req.body);
        console.log(newCoupon);
        await newCoupon.save();
        res.status(201).json({ message: "Coupon added successfully" });
    } catch (error) {
        console.log(error);
    }
}

export const editCoupon = async (req, res) => {
    try {
        const { code,discountValue,maximumDiscount,validFrom,validUntil,cCode} = req.body;
        const  checkCoupon = await Coupon.findOne({ code: code.trim() });
        if(checkCoupon){
            return res.status(401).json({ message: "Coupon name already takken"})
        }
        if(discountValue<1){
            return res.status(400).json({ message: "Discount value should be greater than 1"})
        }
            const coupon = await Coupon.findOne({ code: cCode});
            if (!coupon) {
                return res.status(404).json({ message: "Coupon not found" });
                }
                coupon.code=code;
                coupon.discountValue = discountValue;
                coupon.maximumDiscount = maximumDiscount;
                coupon.validFrom = validFrom;
                coupon.validUntil = validUntil;
                await coupon.save();
                res.status(200).json({ message: "Coupon updated successfully" });
                } catch (error) {
                    console.log(error);
                    }
}

export const view_coupon_details = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 5; 
    const skip = (page - 1) * limit;
    const totalCoupons = await Coupon.countDocuments()
    const totalPages = Math.ceil(totalCoupons / limit);


    const user = await User.findOne({ email: req.session.adminEmail })
    const coupon = await Coupon.find().populate({
        path: 'applicableProducts',
        model: 'Product',
        select: 'product_image',
        options: { strictPopulate: false },
    }).skip(skip)
        .limit(limit);;
    try {
        res.render("admin/couponManage.ejs", {
            user, coupon, totalPages,
            currentPage: page,
            limit
        })
    } catch (error) {
        console.log(error);
    }
}