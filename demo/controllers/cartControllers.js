import ProteinHubContent from "../models/ProteinHub.js";
import Product from '../models/productSchema.js'
import User from "../models/user/userSchema.js";
import Carts from '../models/cartSchema.js'
import session from 'express-session';


 

export const productDetail = async (req, res) => {
    try {
        const productId = req.query.productId; 
        const user=await User.findOne(req.session.user_id) ;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('user/product_details.ejs', { user, product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};




export const viewCart = async (req,res)=>{
    try {
        const user=await User.findOne(req.session.user_id) ;
        let  cart=await Carts.findOne(req.session.user_id) ;
        const productId = req.query.productId;
        const quantity= req.query.quantity;
        const Flavor=req.query.flavor;
        const product = await Product.findById(productId);
        if (!cart) {
            // If no cart, create a new cart object
            cart = new Carts({
                userId: user._id,
                products: [{
                    productId: product._id,
                    quantity: quantity,
                    price: product.price,
                    Flavor: Flavor
                }]
            });
        } else {
            // If cart exists, add the product to it
            cart.products.push({
                productId: product._id,
                quantity: quantity,
                price: product.price,
                Flavor: Flavor
            });
        }

        // Save the cart and render the view
        await cart.save().then(() => {
            res.redirect('/Cart')
            
        });
    } catch (error) {
        console.log(error)
    }
}


export const Cart = async (req,res)=>{
    try {
        const user=await User.findOne(req.session.user_id) ;
        let  cart=await Carts.findOne(req.session.user_id) ;
        const product = await Product.find();
        

        const productIds=cart.products.map(item => item.productId)
        const num_item=productIds.length;
        const products = await Product.find({ _id: { $in: productIds } });


        let cart_akn;
        let address_akn
        let payment_akn 
        let msg

        res.render('user/address.ejs', { user, cart, products, totalAmount: cart.totalAmount,num_item,cart_akn:true,address_akn:false,payment_akn:false,msg:''});

    }
    catch(error){
      console.log(error)
    }

}

