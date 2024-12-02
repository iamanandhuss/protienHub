import session from "express-session";
import User from "../../model/userSchema.mjs";
import Product from "../../model/productSchema.mjs";
import ProteinHubContent from "../../model/ProteinHub.mjs";
import Categories from "../../model/CategorySchema.mjs";
import Rattings from "../../model/ratting.mjs";



export const addToFav = async (req, res) => {
    try {
        const { _id } = req.query;
        const user = await User.findByIdAndUpdate(
            req.session._id,
            {
                $addToSet: { favorites: _id },
            },
            { new: true }
        )
        const result = await user.save();
        if (result) {
            res.status(200).json({ message: "Product added to favorites", result });
        } else {
            res.status(400).json({ message: "Error adding product to favorites" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error adding product to favorites" });
        console.log(error);
    }
}

export const wishList = async (req, res) => {
    const user = await User.findOne({ _id: req.session._id }).populate({
        path: 'favorites',
        model: Product,
        options: { strictPopulate: false },
    });
    console.log(user);
    try {
        res.render("user/favorites.ejs", { user })
    } catch (error) {
    }
}

export const removeFromFav = async (req, res) => {
    try {
        const { _id } = req.query;
        const user = await User.findByIdAndUpdate(
            req.session._id,
            {
                $pull: { favorites: _id },
            },
            { new: true }
        )
        const result = await user.save();
        if (result) {
            res.status(200).json({ message: "Product removed from favorites", result });
        } else {
            res.status(400).json({ message: "Error removing product from favorites" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error removing product from favorites" });
        console.log(error);

    }
}