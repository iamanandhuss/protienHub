import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import category from '../../model/CategorySchema.mjs'
import Product from '../../model/productSchema.mjs';


//view_categories
export const view_categories = async (req, res) => {
    const products = await Product.find();
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = parseInt(req.query.limit) || 6; // Items per page, default is 10
    const skip = (page - 1) * limit;
    const totalcategories = await category.countDocuments()
    const totalPages = Math.ceil(totalcategories / limit);

    const item = await category.find().sort({ _id: 1 }).skip(skip)
    .limit(limit);
    const categories = item.map((item, index) => ({
        serialNumber: "#" + (index + 200 + 1), // Serial number starting from 1
        ...item.toObject(), // Convert Mongoose document to plain object
    }))
    const user = await User.find();
    res.render('admin/categoryList.ejs', {
        user, categories, totalPages,
        currentPage: page,
        limit
    })
}
//block_categories 
export const blockcategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const Categories = await category.findById(categoryId);

        Categories.status = 'active';
        await Categories.save();
        res.redirect('/admin/view_categories')
    } catch (error) {
        console.log(error);
    }
}

//unblock_categories
export const unblockcategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const Categories = await category.findById(categoryId);

        Categories.status = 'inactive';
        await Categories.save();
        res.redirect('/admin/view_categories')
    } catch (error) {
        console.log(error);
    }
}
//viewInformation
export const viewproduct = async (req, res) => {
    try {
        const categories_id = req.params.id;
        const categories = await category.findById(categories_id);
        const user = await User.find();
        const products = await Product.find();
        res.render('admin/categoryDetails.ejs', { user, products, categories })
    } catch (error) {

    }
}


//get form
export const addCategory = async (req, res) => {
    try {
        const user = await User.find();
        res.render('admin/addCategory.ejs', { user })
    } catch (error) {

    }


}

//create new category
export const createCategory = async (req, res) => {

    // Destructure the form data from req.body
    const { category_name, category_slug, description, parent_category, status } = req.body;
    try {
        const existingCategory = await category.findOne({ category_name });
        if(existingCategory){
            return res.status(400).json({ message: 'Category already exists' });
        }
        const newCategory = new category({
            category_name,
            category_slug,
            description,
            parent_category,
            status   
        })
        await newCategory.save().then((result)=>{
            return res.status(200).json({ message: 'Category created Sucessfully' });
        }).catch((error)=>{
            return res.status(500).json({ message: 'Category creation failed' });
        })
    }
    catch (error) {
        
    }


}