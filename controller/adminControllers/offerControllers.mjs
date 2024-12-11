import express, { response } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import User from '../../model/userSchema.mjs';
import category from '../../model/CategorySchema.mjs'
import Product from '../../model/productSchema.mjs';
import Coupon from '../../model/couponSchema.mjs';
import Offer from '../../model/offer.mjs';
// render the offer page
export const create_Offers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const totalOffer = await Offer.countDocuments()
    const totalPages = Math.ceil(totalOffer / limit);
    //   
    const offers = await Offer.find().skip(skip)
        .limit(limit);;
    const user = await User.findOne({ email: req.session.adminEmail })
    const Category = await category.find();
    const products = await Product.find();
    try {
        res.render('admin/createOffer.ejs', {
            user, Category, products, offers, totalPages,
            currentPage: page,
            limit
        })

        console.log("true");
    } catch (error) {
        console.log(error);
    }
}

// create a new offer
export const addOffers = async (req, res) => {
    console.log(req.body);
    const associatedData = req.body.associatedData;
    console.log(associatedData);
    try {
        const { offerName, offerDescription, offerPercentage, offerType, associatedData } = req.body;
            const isExist = await Offer.findOne({ offerName });
            if (isExist) {
                return res.status(409).json({ error: 'Offer name already exists.' });
            }
            // Create a new offer
            const newOffer = new Offer({
                offerName,
                offerDescription,
                offerPercentage,
                offerType,
                associatedData,
            });
            if (offerType === 'product') {
                const result = await Product.updateMany(
                    { _id: { $in: associatedData } },
                    { $set: { discount: offerPercentage } }
                );
                console.log('Products updated:', result);
            } else if (offerType === 'category') {
                const result = await Product.updateMany(
                    { categories: { $in: associatedData } }, 
                    { $set: { discount: offerPercentage } }
                );
                console.log('Category products updated:', result);
            }else if (offerType === 'all') {
                const result = await Product.updateMany(
                    {}, 
                    { $set: { discount: offerPercentage } }
                );
                console.log('Category products updated:', result);
            }

            await newOffer.save();
            return res.status(201).json({ message: 'Offer created successfully.', offer: newOffer });
    } catch (error) {
        console.error('Error adding offer:', error);

        // Send error response
        if (!res.headersSent) {
            return res.status(400).json({ error: 'An internal server error occurred.' });
        }
    }
};