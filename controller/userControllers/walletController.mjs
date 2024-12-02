import session from 'express-session';
import Coupon from '../../model/couponSchema.mjs'
import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs'
import Order from '../../model/orderItemSchema.mjs'
import ProteinHubContent from '../../model/ProteinHub.mjs'
import Carts from '../../model/cartSchema.js'
import Wallet from '../../model/wallet.mjs'

export const wallet = async(req,res)=>{
    const user = await User.findOne({_id:req.session._id});
    let wallet = await Wallet.findOne({ userId: req.session._id });
    try {
        res.render('user/userWallet.ejs',{user,wallet})
    } catch (error) {
        
    }
} 