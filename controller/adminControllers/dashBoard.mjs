import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs';

export const dashboard=async(req,res)=>{
    try {
      const user = await User.findOne({email:req.session.adminEmail})
      res.render('admin/dashboard.ejs',{user})
    } catch (error) {
      console.log(error);
    }
  }