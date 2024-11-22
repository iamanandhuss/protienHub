import session from 'express-session';

import { title } from "process";
import { log } from "console";


import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs'
import ProteinHubContent from '../../model/ProteinHub.mjs'

//get the profile page
export const profile=async(req,res)=>{
    try {
        if(req.session._id)
        {
            const user = await User.findOne({_id:req.session._id});
            const data=req.session._id
             res.render('user/userProfile.ejs',{user,msg:""})
        }
    } catch (error) {
        
    }
}
export const editProfile=async(req,res)=>{
    const user = await User.findOne({_id:req.session._id});
    const { username, Phone } = req.body;
    const updateFields = {};
    const msg='';
    if (username) updateFields.username = username;
    if (Phone) updateFields.Phone = [Phone];
    try {
        const result=await User.updateOne(
            {_id:req.session._id},
            {$set:updateFields}  
        )
        if(!result){
           
            res.redirect('/my-profile')
        }
        
        res.redirect('/my-profile')
         
    } catch (error) {
        console.log(error); 
        return res.status(400).json({ message: "Failed to update user" });
    }  
}