import session from 'express-session';

import { title } from "process";
import { log } from "console";


import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs'
import ProteinHubContent from '../../model/ProteinHub.mjs'


export const homepage=async(req,res)=>{
try {
    if(req.session._id)
    {
        const user = await User.findOne({_id:req.session._id});
        const products = await Product.find({status:"active"}).limit(4);
        const product = await Product.find({status:"active"});
        const proteinHubContent = await ProteinHubContent.find();
        res.render('user/homePage.ejs',{ user,products,proteinHubContent,product})
    }
    else{
        res.redirect('/login')
    }
    
} catch (error) {
   console.log(error); 
}
}
 