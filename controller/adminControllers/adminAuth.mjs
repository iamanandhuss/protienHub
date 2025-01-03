import session from 'express-session';
import bcrypt from 'bcrypt'
import { log } from "console";


import multer from 'multer'
import { cloudinary } from '../../uploads/cloudinary.mjs';


import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs';





export const adminLogin=(req,res)=>{
    try {
       res.render('admin/adminLogin.ejs') 
    } catch (error) {
      console.log(error);  
    }
}

export const loginCred=async(req,res)=>{
   try {
    const { username, password }=req.body;
    const user = await User.findOne({ username });
    if(!user)  res.status(404).json({ 
      success: false,
      message:'User not found'});
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch)  res.status(403).json({ 
      success: false,
      message:'Invalid password'});
    if(!user.is_admin) res.status(402).json({ 
      success: false,
      message:'user is not permitted'});
    const adminData=
    {
        _id:user._id,
        username:user.username,
        email:user.email,
    }
    req.session.adminEmail=adminData.email;
    res.status(200).json({
      success: true,
      message: "login success",
    });
    // res.redirect('/admin/dashboard')
   } catch (error) {
    
   }
}














export const adminlogOut =(req,res)=>{ 
  try {
    req.session.adminEmail=""
    return res.redirect('/admin/login');  } catch (error) {
    console.log(error);
  }
   
}





