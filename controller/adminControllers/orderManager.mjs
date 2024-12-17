import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs';
import Order from '../../model/orderItemSchema.mjs';





export const view_order_list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = parseInt(req.query.limit) || 5; // Items per page, default is 10
    const skip = (page - 1) * limit;
    const totalOrder = await Order.countDocuments()
    const totalPages = Math.ceil(totalOrder / limit);

    const user = await User.findOne({ email: req.session.adminEmail })
    const products = await Product.find()
    const order = await Order.find().populate({
      path: 'user',
      select: 'username',
      model: User,
      options: { strictPopulate: false },
    }).skip(skip)
      .limit(limit);

    res.render('admin/orderList.ejs', {
      products, user, order, totalPages,
      currentPage: page,
      limit
    })
  } catch (error) {
    console.log(error);
  }
}
export const order_manage = async (req, res) => {


  const user = await User.findOne({ email: req.session.adminEmail })
  const products = await Product.find()
  const orderId = req.query; // Extract orderId from query parameter
  const order = await Order.findOne({ _id: orderId.OrderId }).populate({
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
    { _id: order.user._id, },
    { address: 1 }
  );


  try {
    res.render("admin/orderManage.ejs", { user, order, delivaryAddress })
  } catch (error) {
    console.log(error);
  }
}

export const changeStatus = async (req, res) => {
  try {


    const order = await Order.findOne({ _id: req.query.orderId })
    order.orderStatus = req.query.newStatus.trim();





    if (req.query.currentOrder.trim() == "Delivered" || req.query.currentOrder.trim() == "Cancelled") {
      return res.status(304).json({
        msg: `Order allready ${req.query.currentOrder.trim()}`,
        success: false
      })
    }
    order.orderStatus = req.query.newStatus.trim();
    const result = await order.save();
    console.log(result);
    if(req.query.currentOrder.trim()=="Delivered"||req.query.currentOrder.trim()=="Cancelled"){
      return res.status(304).json({message:'cannot change from delivary'})
    }
    if (result) {
      return res.status(201).json({ message: 'Order status changed.'});

      
    } else {
      return res.status(500).json({ message: 'Failed to change order status.'});

    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.'});

  }
}