import session from 'express-session';

import { title } from "process";
import { log } from "console";


import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs'
import Order from '../../model/orderItemSchema.mjs'
import ProteinHubContent from '../../model/ProteinHub.mjs'
import Carts from '../../model/cartSchema.js' 
export const orderDetails=async(req,res)=>{
    try {
        const user = await User.findOne(req.session._id);
        res.render('user/userOrderlist.ejs',{user})
    } catch (error) {
        
    }
        
    }

    

    export  const orderDetail = async(req,res)=> {
        try {
          const user = await User.findOne({_id:req.session._id});
          
          const order=await Order.findById(orderId)
          const productIds = order.products.map(item => item.product); // Extract product IDs
          const items = await Product.find({ _id: { $in: productIds } });
          

          
          let cart_akn;
          let address_akn 
          let payment_akn 
          let msg
    res.render('user/orderAddress.ejs',{items,order,user,cart_akn:true,address_akn:true,payment_akn:false,msg:''})
        } catch (error)  { 
          console.log(error);   
        }
    }  
let orderId=""; 

    export const addToOrder=async(req,res)=>{
      const cartId=req.body.cart; 
      const cart = await Carts.findById(cartId);
      try {
        const products = cart.products.map(item => ({
          product: item.productId, // Mapping productId from cart to product in the order
          quantity: item.quantity,
          price: item.price,
          orderStatus: "Pending", // Initial order status
        }));
        const totalAmount = cart.totalAmount;
        const newOrder = new Order({
          user: req.session._id,
          products: products,
          totalAmount: totalAmount,
          paymentMode: cart.paymentMode || "cod", // Default to COD if not specified
          shipping_address: cart.shipping_address, // Optional address field
          orderStatus: "Pending",
          paymentStatus: "Pending",
        });

        
        if(cart){
          await newOrder.save().then((result)=>orderId=result._id);
        }else{ 
          return res.status(404).json({ message: "Cart not found" }); 
        }
        await Carts.findByIdAndDelete(cartId);
        res.status(201).json({ message: "Order created successfully",});

      } catch (error) {
        console.error("Order creation failed:", error);
        res.status(500).json({ message: "Failed to create order", error: error.message });
      }
    }  

export const addOrderAddress=async(req,res)=>{
  const { address } = req.body;
  let order=await Order.findById(orderId)
  const OrderAddress = await User.findOne(
    { _id: req.session._id, 'address._id': address },
    { 'address.$': 1 }
  );
  console.log(OrderAddress);
  order.shipping_address=OrderAddress._id;
  const orderAddressadded=await order.save();
 if(orderAddressadded){
  res.status(201).json({ message: "Address added successfully",});
}
else
{res.status(500).json({ message: "Failed to add Order",});
}
  try {
  } catch (error) {
    
  }
}
//render mode of payments
export const paymentDetails =async(req,res)=>{ 
  const msg="sd" 
  const order=await Order.findById(orderId)
  const productIds = order.products.map(item => item.product); // Extract product IDs
  const items = await Product.find({ _id: { $in: productIds } });
  const address = await User.findOne({_id:req.session._id},{ address: 1});
 console.log(req.session);
  const user = await User.findOne({_id:req.session._id});
  res.render('user/payment.ejs',{items,order,msg,user,address,cart_akn:true,address_akn:true,payment_akn:true,msg:''})
}  

export const paymentMethod=async(req,res)=>{
  const {paymentMethod}=req.body;
  console.log(paymentMethod);
  try {
    if(!req.session.orderId){
      let order=await Order.findById(orderId)
      console.log(order);
      order.paymentMode=paymentMethod;
      const PaymentMet=await order.save();
      if (paymentMethod){
        res.status(201).json({ message: "Payment method updated successfully",});
      }else{
        res.status(404).json({ message: "Payment method not found" });
      }
    }
    else{
       let order=await Order.findById(orderId)
      req.session.flash.order_id=order._id;
      console.log(req.session.flash.order_id);
      order.paymentMode=paymentMethod;
      const PaymentMet=await order.save();
      if (paymentMethod){
        res.status(201).json({ message: "Payment method updated successfully",});
      }else{
        res.status(404).json({ message: "Payment method not found" });
      } 
     
    }  
  } catch (error) {
    
  } 
}
//order sucess message
export const orderSucess= async(req,res)=>{
  const user = await User.findOne({_id:req.session._id});
  res.render('user/orderSucess.ejs',{user}) 
}

export const my_order= async(req,res)=>{
  try {
    const user = await User.findOne({_id:req.session._id});
    try {
      const orders=await Order.find({ user: req.session._id }).sort({createdAt: -1}).populate({
        path: 'products.product',
        select: 'product_name price product_image categories discount Flavor',
        model: Product,  
        options: { strictPopulate: false },
      })
    res.render("user/userOrderhistory.ejs",{orders,user})
  } catch (error) { 
      console.error("Error fetching orders:", error);
      // Handle the error (e.g., send a response to the client)
  }
    
    
  } catch (error) { 
    console.log(error);
  }
}
 

export const cancelOrder=async(req,res)=>{
   const cancelReson=req.query;
   console.log(orderId);
   let order=await Order.findById(cancelReson.orderId)
   order.cancelReason=cancelReson.reason;
   order.cancelDescription=cancelReson.description;
   order.orderStatus="Cancelled";
   await order.save().then((result)=>{
    res.status(200).json({message:"Order cancelled successfully"})
    })
    .catch((err)=>{
      res.status(500).json({message:"Error cancelling order"})
   }) 
}  