import session from 'express-session';




import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs'
import ProteinHubContent from '../../model/ProteinHub.mjs'
import Rattings from "../../model/ratting.mjs";
import Carts from '../../model/cartSchema.js' 


export const viewCart = async (req,res)=>{
        try {
            const user= await User.findOne({_id:req.session._id});
            let  cart=await Carts.findOne({userId:req.session._id}) ;
            const productId = req.query.productId;
            const product = await Product.findById(productId);
            product.stock_quantity-1
            if (!cart) {
                // If no cart, create a new cart object
                cart = new Carts({
                    userId: user._id,
                    products: [{
                        productId: product._id,
                        price: product.price,
                        discount: product.discount,
                        gst:product.gst,
                    }]
                });
            } else {
                // If cart exists, add the product to it
                const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
                if(productIndex>-1)
                {
                    const product = await Product.findOne({ _id: productId});
                    if(!cart.products[productIndex].quantity+Number(1)<product.stock_quantity)
                    {
                        cart.products[productIndex].quantity += Number(1);
                    }else{
                        res.status(400).json({message:"Maximum quantity reached"})
                    }
                     
                }else{cart.products.push({
                    productId: product._id,
                    price: product.price,
                    discount: product.discount,
                    gst:product.gst,
                } ); 
            }
                 
            } 
    
            product.stock_quantity -= 1;
             await product.save();
            // Save the cart and render the view
            await cart.save().then(() => {
                res.status(200).json({ message: 'Product added to cart'}); 
            });
        } catch (error) { 
            console.log(error)
        }
    } 


    export const Cart = async (req,res)=>{
        try {
            const ratting=await Rattings.find();
            const user= await User.findOne({_id:req.session._id});
            let  cart=await Carts.findOne({userId:req.session._id}) ;
            if(!cart){
                cart = new Carts({
                    userId: user._id,
                    products: []
                });
                cart.save();
            }
            const product = await Product.find();
            
    
            const productIds=cart.products.map(item => item.productId)
            const num_item=productIds.length;
            const products = await Product.find({ _id: { $in: productIds } });
    
    
            let cart_akn;
            let address_akn
            let payment_akn 
            let msg
            res.render('user/viewCart.ejs', { user, cart,ratting, products, totalAmount: cart.totalAmount,num_item,cart_akn:true,address_akn:false,payment_akn:false,msg:''});
    
        }
        catch(error){
          console.log(error)
        }
    
    } 

    export const removeItem= async(req,res)=>{
        const {productId} = req.params;
        const userId = req.session._id;
        try {
            const updatedCart = await Carts.findOneAndUpdate(
                { userId: req.session._id },
                { $pull: { products: { productId: productId } } },
                { new: true } 
            );   
            const product = await Product.findOne({ _id: productId});
            if (!updatedCart) {
                return res.status(404).json({ message: 'Cart or product not found' });
            }
            
            res.status(200).json({ message: 'Product deleted successfully', cart: updatedCart });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
        
    }

    export const updateQty = async (req, res) => {
        const { productId, qty } = req.query; // Assumes qty is the increment/decrement value
        const userId = req.session._id;
    
        try {
            // Retrieve the cart and the specific product
            const cart = await Carts.findOne({ userId, 'products.productId': productId });
            if (!cart) {
                return res.status(404).json({ message: "Cart or product not found." });
            }
    
            // Find the product in the cart
            const product = cart.products.find(p => p.productId.toString() === productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found in the cart." });
            }
    
            // Calculate the new quantity
            const newQuantity = product.quantity + parseInt(qty, 10);
    
            // Validate the new quantity
            if (newQuantity > 3) {
                return res.status(400).json({ message: "Quantity cannot exceed 3." });
            }
            if (newQuantity < 1) {
                return res.status(401).json({ message: "Quantity cannot be less than 1." });
            }
    
            // Update the quantity if validation passes
            const updatedCart = await Carts.findOneAndUpdate(
                { userId, 'products.productId': productId },
                { $set: { 'products.$.quantity': newQuantity } },
                { new: true }
            );
    
            // Respond with the updated cart
            return res.status(200).json({ message: "Quantity updated successfully.", updatedCart });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while updating the cart.", error });
        }
    };
    

export const reverseQty=async(req,res)=>{
    try {
        const product = await Product.findOne({ _id: req.query._id});
        product.stock_quantity+=Number(req.query.qty);
        await product.save();
    } catch (error) {     
    }
}
    
    