import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs';

export const listUser = async (req, res) => {
    const user = await User.findOne({ email: req.session.adminEmail })
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = parseInt(req.query.limit) || 6; // Items per page, default is 10
    const skip = (page - 1) * limit;
    const totalUser = await User.countDocuments()
    const totalPages = Math.ceil(totalUser / limit);
    const Users = await User.find().skip(skip)
        .limit(limit);
    try {
        res.render('admin/userManage.ejs', {
            user, Users, totalPages,
            currentPage: page,
            limit
        })
    } catch (error) {
        console.log(error);
    }
}

export const
    blockUser = async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await User.findById(userId);
            console.log(user);
            user.is_blocked = true;
            await user.save();
            res.redirect('/admin/manage_users')
        } catch (error) {
            console.log(error);
        }
    }

export const unblockUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        console.log(user);
        user.is_blocked = false;
        await user.save();
        res.redirect('/admin/manage_users')
    } catch (error) {
        console.log(error);
    }
}

export const userDetails = async (req, res) => {
    const user = await User.findOne({ email: req.session.adminEmail })
    try {
        res.render('admin/userDetails.ejs', { user })
    } catch (error) {
        console.log(error);
    }
}

