import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs';
import Order from '../../model/orderItemSchema.mjs';



export const dashboard=async(req,res)=>{
    try {
      const order=await Order.find()
      let tottalvalue=order.map((order)=>order.totalAmount).reduce((tottal,amount)=>tottal+=amount)
      const page = parseInt(req.query.page) || 1; // Current page, default is 1
      const limit = parseInt(req.query.limit) || 5; // Items per page, default is 10
      const skip = (page - 1) * limit;
      const totalOrder = await Order.countDocuments()
      const totalPages = Math.ceil(totalOrder / limit);
      const orders=await Order.find().populate({
        path: 'user',
        select: 'username',
        model: User,  
        options: { strictPopulate: false },
      }).populate({
        path: 'products.product',  
        select: 'product_name price product_image categories discount Flavor',
        model: Product,  
        options: { strictPopulate: false },
      }).skip(skip)
      .limit(limit);
      const user = await User.findOne({email:req.session.adminEmail})
      const activeOrder = await Order.find({ orderStatus: { $ne: 'Delivered' } });
      const compOrder = await Order.find({orderStatus: 'Delivered'});
      let  compOrderTot=0
      let activeOrderTot=0
      // 
      if(!activeOrder.length){
        activeOrderTot=0
      }else{
         activeOrderTot=activeOrder.map((order)=>order.grandTottal).reduce((tottal,curent)=>tottal+=curent);
      }
      // compOrder
      if(!compOrder.length){
        compOrderTot=0
      }else{
        compOrderTot=compOrder.map((order)=>order.grandTottal).reduce((tottal,curent)=>tottal+=curent)
      }

      res.render('admin/dashboard.ejs',{user,tottalvalue,orders,activeOrderTot,compOrderTot,totalPages,
        currentPage: page,
        limit})
    } catch (error) {
      console.log(error);
    }
  }