import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
import user from '../../models/user/userSchema.js'

export const adminLogin = async(req,res)=>{
    try {
        if(req.session.user_id)
        {
            res.redirect('/adminpage')  
        }else{
            res.redirect('/adminpage')
        }
        
    } catch (error) {
      console.log(error);  
    }
}
export const adminAuth = async(req,res)=>{
    const{username,password}=req.body;
    const userData = await user.findOne({ fullName: username, is_admin: 1 });   
     if(userData){
        if(password==userData.password)
        {
            req.session.user_id = userData._id;
            req.session.fullName = userData.name;
            req.session.isBlocked = userData.is_blocked
            res.redirect('/adminpage')
        }
        else {
            res.render('admin/adminLogin.ejs')
        }
    }

    
    
    
   
    
    try {
       console.log(userData.password == password);
    } catch (error) {
        
    }
}