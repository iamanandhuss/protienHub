import session from "express-session";
import User from "../../model/userSchema.mjs";
import Product from "../../model/productSchema.mjs";
import ProteinHubContent from "../../model/ProteinHub.mjs";
import Categories from "../../model/CategorySchema.mjs";
import Rattings from "../../model/ratting.mjs";
import Coupon from "../../model/couponSchema.mjs";
import Order from "../../model/orderItemSchema.mjs"


export const coupon=async(req,res)=>{
    const user= await User.findOne({_id:req.session._id});
    const coupon=await Coupon.find();
    try {
     res.render("user/coupons.ejs",{user,coupon})   
    } catch (error) {
        console.log(error)
    }
}

// add coupon to the order
export const addCoupon=async(req,res)=>{
    try {
        const {couponId,orderId}=req.query;
        const coupon=await Coupon.findOne({_id:couponId});
        const order=await Order.findOne({_id:orderId})
        order.couponCode=coupon.code;
        order.couponDiscound=coupon.discountValue;
        order.couponId=coupon._id;
        order.grandTottal=(order.totalAmount/100)*(100-order.couponDiscound)
        const response=await order.save();
        if(response){
            res.status(200).json({ message: 'Coupon added to the order'});
        }else{
            res.status(400).json({ message: 'Failed to add coupon to the order'});
        }
    } catch (error) {
     console.log(error);   
    }
}

export const removeCoupon=async(req,res)=>{
    try {
        const order=await Order.findByIdAndUpdate({_id:req.query.orderId},{$unset:{couponCode:1,couponDiscound:1}})
            order.grandTottal=order.totalAmount;
        const response=order.save();
        if(response){
            res.status(200).json({ message: 'Coupon removed from the order'});
        }else{
            res.status(400).json({ message: 'Coupon not removed from the order'});
        }


    } catch (error) {
        console.log(error)
    }
}

export const couponWiseProduct=async(req,res)=>{
    console.log(req.query.couponId);
    const user= await User.findOne({_id:req.session._id});
    const coupon=await Coupon.find({_id:req.query.couponId}).populate({
        path: 'applicableProducts',
        model: Product,
        options: { strictPopulate: false },
    }); 
    req.session.code=coupon[0].code;
    req.session.discountValue=coupon[0].discountValue;
    req.session.coupon_id=coupon[0]._id;
    console.log(req.session);
    res.render("user/couponWiseProduct.ejs",{user,coupon})
        try {

        } catch (error) {
           console.log(error); 
        }
}