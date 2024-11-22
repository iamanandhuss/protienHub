import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs';
import Order from '../../model/orderItemSchema.mjs';
 


 

export const view_order_list=async(req,res)=>{
    try {
      
      const user = await User.findOne({email:req.session.adminEmail})
      const products=await Product.find()
      const order=await Order.find().populate({
        path: 'user',
        select: 'username',
        model: User,  
        options: { strictPopulate: false },
      })
      res.render('admin/orderList.ejs',{ products,user,order})
    } catch (error) {
      console.log(error);
    }
    }
export const order_manage =async(req,res)=>{
  const user = await User.findOne({email:req.session.adminEmail})
  const products=await Product.find()
  const orderId = req.query; // Extract orderId from query parameter
  const order=await Order.findOne({_id:orderId.OrderId}).populate({
    path: 'user',
    select: 'username email Phone address',
    model: User,  
    options: { strictPopulate: false },
  }).populate({
    path: 'products.product',
    select: 'product_name price product_image categories discount Flavor',
    model: Product,  
    options: { strictPopulate: false },
  })


 
  
  const delivaryAddress = await User.findOne(
    { _id: order.user._id,},
    { address: 1 }
);


  try {
      res.render("admin/orderManage.ejs",{user,order,delivaryAddress})
  } catch (error) { 
      console.log(error);
  }
} 

export const changeStatus=async(req,res)=>{
  try {
    const order=await Order.findOne({_id:req.query.orderId})
    if(req.query.currentOrder.trim()=="Delivered"||req.query.currentOrder.trim()=="Cancelled"){
      return res.status(304).json({
        msg:`Order allready ${req.query.currentOrder.trim()}`,
        success:false
      })
    }
    order.orderStatus=req.query.newStatus.trim();
    const result=await order.save();
   if(result){
    return res.status(200).json({
      msg:"Status changed SucessFully",
      success:true
    })
   }else{}
   return res.status(500).json({
    msg:"failed",
    success:false
  })
  } catch (error) {
    return res.status(500).json({
      msg:"internal server error",
      success:false
    })
    console.log(error);
  }
  }