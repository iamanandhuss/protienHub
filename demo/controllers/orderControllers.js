import ProteinHubContent from "../models/ProteinHub.js";
import Product from '../models/productSchema.js'
import User from "../models/user/userSchema.js";
import Carts from '../models/cartSchema.js'
import session from 'express-session';


export  const orderDetail = async(req,res)=> {
    try {
      const user=await User.findOne(req.session.user_id) ;
      let  cart=await Carts.findOne(req.session.user_id) ;
      const product = await Product.find();
      const order=await User.findOne(req.session.user_id) ;
      

      const productIds=cart.products.map(item => item.productId)
      const num_item=productIds.length;
      const products = await Product.find({ _id: { $in: productIds } });


      let cart_akn;
      let address_akn
      let payment_akn
      let msg

res.render('user/order.ejs',{ user, products,cart_akn:true,address_akn:true,payment_akn:false,msg:''})
    } catch (error) {
      console.log(error);  
    }
}