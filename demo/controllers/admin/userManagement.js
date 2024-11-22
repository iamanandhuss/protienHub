import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import Users from '../../models/user/userSchema.js'
import Product from '../../models/productSchema.js';



export const blockUser = async (req, res) => {
    const userId=req.params.id;
        try{
        const  user = await Users.findById(userId);
        console.log(user);
        user.is_blocked = true;
        await user.save();
        res.redirect('/manage_users')
    } catch (error) {
        console.log(error);
    }
}

export const unblockUser = async (req, res) => {
    const userId=req.params.id;
        try{
        const  user = await Users.findById(userId);
        console.log(user);
        user.is_blocked = false;
        await user.save();
        res.redirect('/manage_users')
    } catch (error) {
        console.log(error);
    }      
}

export const viewUser =(req,res)=>{
try {
    res.redirect('/manage_users')
} catch (error) {
    console.log(error);
}

} 

