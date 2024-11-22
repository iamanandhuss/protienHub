import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import categories from '../../models/CategorySchema.js';
import Product from '../../models/productSchema.js';



export const blockcategory = async (req, res) => {
    const categoryId=req.params.id;
        try{
        const  Categories = await categories.findById(categoryId);
        
        Categories.status = 'active';
        await Categories.save(); 
        res.redirect('/view_categories')
    } catch (error) {
        console.log(error);
    }
}

export const unblockcategory = async (req, res) => {
    const categoryId=req.params.id;
        try{
        const  Categories = await categories.findById(categoryId);
        
        Categories.status = 'inactive';
        await Categories.save();
        res.redirect('/view_categories')
    } catch (error) {
        console.log(error);
    }      
}

export const addCategory =async(req,res)=>{
    try {
        res.render('admin/addCategory.ejs')
    } catch (error) {
        
    }
    

} 
export const add_category =async(req,res)=>{
    
        // Destructure the form data from req.body
        const { category_name, category_slug, category_description, parent_category, status } = req.body;
        const  Categories = await categories.find();
        const newCategory = new categories({
            category_name: category_name,
            category_slug: category_slug,
            category_description: category_description,
            parent_category: parent_category,
            status: status,
        });
        try {
        await newCategory.save();
        res.redirect('/view_categories');
    
    } 
    catch(error)
    {
        console.log(error);
        res.status(500).send('An error occurred while adding the category.');
    }
    

}


