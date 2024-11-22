import ProteinHubContent from "../models/ProteinHub.js";
import Product from '../models/productSchema.js'
import User from "../models/user/userSchema.js";
import session from 'express-session';

export const homePage = async(req,res)=>{
    try {
        const limit = 10; // Number of items per page
        const page = parseInt(req.query.page) || 1; // Current page number
        const skip = (page - 1) * limit; // Number of documents to skip
        const products = await Product.find()  
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .skip(skip) // Skip the previous pages
        .limit(8); // Limit to 'limit' items
        const totalProduct = await Product.countDocuments({ isBlocked: false }); // Get total count of products
console.log(req.session.user_id);
        const user=await User.findOne(req.session.user_id) ;
        const proteinHubContent = await ProteinHubContent.find();
        res.render('user/homePage.ejs',{ proteinHubContent,user,products })

        console.error(error); 
        
    }
    catch (error) {
        
    }
}

export const wishlist = (req,res)=>{
    res.render('user/userWishlist.ejs')
} 

export const wallet = (req,res)=>{
    res.render('user/userWallet.ejs')
}

export const profile = async(req,res)=>{
    try {
        const user=await User.findOne(req.session.user_id)
        res.render('user/userProfile.ejs',{ user })  
    } catch (error) {
        
    }
    
}

export const orderList = (req,res)=>{
    res.render('user/userOrderlist.ejs')
}

export const orderHistory = (req,res)=>{
    res.render('user/userOrderhistory.ejs')
}

export const address = (req,res)=>{
    res.render('user/userAddress.ejs')
}


