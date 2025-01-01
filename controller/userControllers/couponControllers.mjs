import session from "express-session";
import User from "../../model/userSchema.mjs";
import Product from "../../model/productSchema.mjs";
import ProteinHubContent from "../../model/ProteinHub.mjs";
import Categories from "../../model/CategorySchema.mjs";
import Rattings from "../../model/ratting.mjs";
import Coupon from "../../model/couponSchema.mjs";
import Order from "../../model/orderItemSchema.mjs"
import Carts from '../../model/cartSchema.js' 



export const coupon=async(req,res)=>{
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const totalProducts = await Coupon.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);  

    const user= await User.findOne({_id:req.session._id});
    const coupon=await Coupon.find()
    const avalCoupon=await Coupon.find().skip(skip)
    .limit(limit).sort({validUntil:-1});
    try {
     res.render("user/coupons.ejs",{user,coupon,avalCoupon, totalPages,
        currentPage: page, 
        limit})   
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
        {

            const user= await User.findOne({_id:req.session._id});
            if (!user) {
                throw new Error('User not found');
            }
            const coupon=await Coupon.findOne({_id:couponId});
            if (!coupon) {
                throw new Error('Coupon not found');
            }
                // Check if the coupon is already in the user's `couponUsed` array
                const couponIndex = user.couponUsed.findIndex((item) => item.couponId.toString() === couponId);

                if (couponIndex > -1) {
                    // If the coupon exists, increment its usage count
                    user.couponUsed[couponIndex].usageCount += 1;
                  } else {
                    // Otherwise, add a new couponUsage object to the array
                    user.couponUsed.push({
                      couponId: coupon._id,
                      usageCount: 1, // Initial usage count
                    });
                  }

                  await user.save();

        }
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
    let  cart=await Carts.findOne({userId:req.session._id}) ;
    const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 6; 
  const skip = (page - 1) * limit;
      
      const ratting=await Rattings.find();
  try {
    const user = await User.findOne({ _id: req.session._id });
    const totalProducts = await Product.countDocuments(); 
    const totalPages = Math.ceil(totalProducts / limit);  

    const products = await Product.find({ status: "active" }).skip(skip)
    .limit(limit); 
    const Category = await Categories.find(
      { status: "active" },
      { category_name: 1 }
    );
    res.render("user/couponWiseProduct.ejs", { user, products, Category,ratting,totalPages,cart,
      currentPage: page, // Add currentPage here
      limit});
  } catch (error) {}
}