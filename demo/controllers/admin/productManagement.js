import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import categories from '../../models/CategorySchema.js';
import Product from '../../models/productSchema.js';

export const add_product=(req,res)=>{
}

    

export const blockproduct=async(req,res)=>{
    const ProductId=req.params.id;
    try{
    const  product = await Product.findById(ProductId);
    
    product.status = 'inactive';
    await product.save();
    res.redirect('/view_all_products')
} catch (error) {
    console.log(error);
}   
    
}
export const unblockproduct=async(req,res)=>{
    const ProductId=req.params.id;
    try{
    const  product = await Product.findById(ProductId);
    
    product.status = 'active';
    await product.save();
    res.redirect('/view_all_products')
} catch (error) {
    console.log(error);
}  
    
}