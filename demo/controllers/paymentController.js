import ProteinHubContent from "../models/ProteinHub.js";
import Product from '../models/productSchema.js'
import User from "../models/user/userSchema.js";
import session from 'express-session';


export const paymentPage=async(req,res)=>{
    try {
        const user=await User.findOne(req.session.user_id) ;
        const product = await Product.find();
        

 

        let cart_akn;
        let address_akn
        let payment_akn 
        let msg
        res.render('user/payment.ejs',{ user,cart_akn:true,address_akn:true,payment_akn:true,msg:""})

    } catch (error) {
        console.log(error);
    }


}

export const orderSucess=async(req,res)=>{
    try {
        const user=await User.findOne(req.session.user_id) ;
        const product = await Product.find();
        

 

        let cart_akn;
        let address_akn
        let payment_akn 
        let msg
        res.render('user/payment.ejs',{ user,cart_akn:true,address_akn:true,payment_akn:true,msg:'Your Order Has Been Placed'})

    } catch (error) {
        console.log(error);
    }


}