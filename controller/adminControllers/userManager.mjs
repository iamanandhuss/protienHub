import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs';
import Order from '../../model/orderItemSchema.mjs'
import Coupon from '../../model/couponSchema.mjs';
import Carts from '../../model/cartSchema.js' 
import Returns from "../../model/returns.mjs"




export const listUser = async (req, res) => {
    const user = await User.findOne({ email: req.session.adminEmail })
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 6; 
    const skip = (page - 1) * limit;
    const totalUser = await User.countDocuments()
    const totalPages = Math.ceil(totalUser / limit);
    const Users = await User.find().skip(skip)
        .limit(limit);
    try {
        res.render('admin/userManage.ejs', {
            user, Users, totalPages,
            currentPage: page,
            limit
        })
    } catch (error) {
        console.log(error);
    }
} 

export const
    blockUser = async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await User.findById(userId);
            console.log(user);
            user.is_blocked = true;
            await user.save();
            res.redirect('/admin/manage_users')
        } catch (error) {
            console.log(error);
        }
    }

export const unblockUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        console.log(user);
        user.is_blocked = false;
        await user.save();
        res.redirect('/admin/manage_users')
    } catch (error) {
        console.log(error);
    } 
}

export const userDetails = async (req, res) => {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 6; // Number of items per page
    const skip = (page - 1) * limit;
  
    try {
      const user = await User.findById(userId);
      const cart = await Carts.findOne({ userId: req.params.id });
      const order = await Order.find({ user: req.params.id })
        .populate({
          path: 'products.product',
          model: 'Product',
          select: 'product_image',
          options: { strictPopulate: false },
        })
        .populate({
          path: 'couponId',
          model: 'Coupon',
          options: { strictPopulate: false },
        });
  
      // Fetch Returns with Pagination
      const totalReturns = await Returns.countDocuments({ user: req.params.id });
      const totalPages = Math.ceil(totalReturns / limit);
      const currentPage = page;
  
      const Return = await Returns.find({ user: req.params.id })
        .populate({
          path: 'products.product',
          select: 'product_name price product_image',
          model: Product,
          options: { strictPopulate: false },
        })
        .skip(skip)
        .limit(limit);
  
      res.render('admin/userDetails.ejs', {
        user,
        order,
        cart,
        Return,
        currentPage,
        totalPages,
        limit,
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  

