import session from 'express-session';
import { razorpayInstance } from '../../services/razorpay.mjs'
import { title } from "process";
import { log } from "console";

import Coupon from '../../model/couponSchema.mjs'
import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs'
import Order from '../../model/orderItemSchema.mjs'
import ProteinHubContent from '../../model/ProteinHub.mjs'
import Carts from '../../model/cartSchema.js'
import Categories from "../../model/CategorySchema.mjs";
import Wallet from "../../model/wallet.mjs"




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
          gst:item.gst,
          discount: item.discount,
          orderStatus: "Pending", // Initial order status

        }));
        const totalAmount = cart.totalAmount;
        const newOrder = new Order({
          user: req.session._id,
          products: products,
          totalAmount: totalAmount,
          grandTottal:totalAmount,
          paymentMode: cart.paymentMode || "cod", // Default to COD if not specified
          shipping_address: cart.shipping_address, // Optional address field
          orderStatus: "Pending",
          paymentStatus: "Pending",
          couponCode:"",
          couponDiscound:"",
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
 

  order.couponCode=req.session.code;
  order.couponDiscound=req.session.discountValue;
  req.session.code=""
  req.session.discountValue=""
  order.shipping_address=address;
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
  let wallet = await Wallet.findOne({ userId: req.session._id });
 try {
   const msg="sd" 
   const order=await Order.findById(orderId)
   req.session.amount=order.grandTottal;
   const productIds = order.products.map(item => item.product); // Extract product IDs
   const items = await Product.find({ _id: { $in: productIds } });
   const address = await User.findOne({_id:req.session._id},{ address: 1});
   const user = await User.findOne({_id:req.session._id});
   const coupon=await Coupon.find().sort({validUntil:-1});
   res.render('user/payment.ejs',{coupon,items,order,msg,user,address,cart_akn:true,address_akn:true,payment_akn:true,msg:'',wallet})
 } catch (error) { 
  console.log(error) 
 }
}  
// add payment method
export const paymentMethod=async(req,res)=>{
  const {paymentMethod}=req.body;
  try {
    if(!req.session.orderId){
      let order=await Order.findById(orderId)
      console.log(order);
      order.paymentMode=paymentMethod;
      console.log(req.session);
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
export const orderSucess = async (req, res) => {
  try {
      const orderId = req.query.orderId;
      if (!orderId) {
          throw new Error('Order ID is missing');
      }

      // Find the user from the session
      const user = await User.findOne({ _id: req.session._id });

      // Find the order by its ID and populate the product details
      const order = await Order.findById(orderId).populate({
          path: 'products.product',
          select: 'product_name price product_image categories discount Flavor',
          model: Product,
          options: { strictPopulate: false },
      });

      // Find the shipping address associated with the order
      const shippingAddress = user.address.find((address) =>
          address._id.equals(order.shipping_address)
      );

      // Render the success page with user, order, and shipping address details
      res.render('user/orderSucess.ejs', { user, order, shippingAddress });
  } catch (error) {
      console.error('Error fetching order details:', error.message);
      res.status(500).json({ message: error.message });
  }
};



// to the order page showing order details
export const my_order= async(req,res)=>{
  try {
    const user = await User.findOne({_id:req.session._id});
    try {
      const page = parseInt(req.query.page) || 1; // Current page, default is 1
      const limit = parseInt(req.query.limit) || 3; // Items per page, default is 10
      const skip = (page - 1) * limit;
      const totalOrders = await Order.countDocuments({ user: req.session._id }); // Total number of products
      const totalPages = Math.ceil(totalOrders / limit);  // Calculate total pages


      const orders=await Order.find({ user: req.session._id }).sort({createdAt: -1}).populate({
        path: 'products.product',
        select: 'product_name price product_image categories discount Flavor',
        model: Product,  
        options: { strictPopulate: false },
      }).skip(skip)
      .limit(limit);
    res.render("user/userOrderhistory.ejs",{orders,user,totalPages,
      currentPage: page, // Add currentPage here
      limit})
  } catch (error) { 
      console.error("Error fetching orders:", error);
  }
    
    
  } catch (error) { 
    console.log(error);
  }
}
 
// cancel the order
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

// reverse order when order is cancelled
export const orderRevQty=async(req,res)=>{
  try {
    let order=await Order.findById({_id:req.query.orderId})
    console.log(order.products.forEach(async(data)=>{
      const product = await Product.findOne({ _id:data.product});
      product.stock_quantity+=Number(data.quantity);
      await product.save();
    }));
  } catch (error) {
    console.log(error);
  }
}





export const paymentRender=async(req,res)=>{
  let order=await Order.findById(orderId)
  try {
    order.paymentMode="Razorpay"
    order.paymentStatus="Paid"
    await order.save();

        const orderAmount=req.session.amount;
        const instance = razorpayInstance;

        const options={ 
            amount:orderAmount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        }

        instance.orders.create(options, async(error, order) => {
            if (error) {
              console.error("Failed to create order:", error);
              return res
                .status(500)
                .json({ error: `Failed to create oreder : ${error.message}` });
            }
            console.log(order.id);
            console.log("hear");
            return res.status(200).json({ orderId: order.id });
          });
    } catch (error) {
        console.error("Error order in checkout : ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



export const OrderListPay=async(req,res)=>{

  const {id}=req.query
  let order=await Order.findById({_id:req.query.orderId})
  try {
    order.paymentMode="Razorpay"
    order.paymentStatus="Paid"
    await order.save();
        const orderAmount=req.session.amount;
        const instance = razorpayInstance;

        const options={ 
            amount:orderAmount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        }

        instance.orders.create(options, async(error, order) => {
            if (error) {
              console.error("Failed to create order:", error);
              return res
                .status(500)
                .json({ error: `Failed to create oreder : ${error.message}` });
            }
            console.log(order.id);
            console.log("hear");
            return res.status(200).json({ orderId: order.id });
          });
    } catch (error) {
        console.error("Error order in checkout : ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


