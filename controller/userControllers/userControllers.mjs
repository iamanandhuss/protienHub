import session from 'express-session';

import { title } from "process";
import { log } from "console";


import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs'
import ProteinHubContent from '../../model/ProteinHub.mjs'
import Offer from '../../model/offer.mjs'
import Rattings from '../../model/ratting.mjs'
import Carts from '../../model/cartSchema.js'
import Banner from '../../model/banner.mjs';


export const homepage=async(req,res)=>{
try {
    if(req.session._id)
    {
        let  cart=await Carts.findOne({userId:req.session._id}) ;
        const ratting=await Rattings.find();
        const user = await User.findOne({_id:req.session._id});
        const products = await Product.find({status:"active"}).limit(4);
        const product = await Product.find({status:"active"});
        const proteinHubContent = await ProteinHubContent.find();
        const banners = await Banner.find({ status: 'active' });
        const offers=await Offer.find().populate({
            path: 'associatedData',
            model: Product,  
            options: { strictPopulate: false },
        })
        res.render('user/homePage.ejs',{ user,products,proteinHubContent,product,offers,ratting,cart,banners})
    }
    else{
        res.redirect('/login')
    }
     
} catch (error) {
   console.log(error); 
}
}
 