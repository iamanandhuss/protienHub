import session from "express-session";
import User from "../../model/userSchema.mjs";
import Product from "../../model/productSchema.mjs";
import Returns from "../../model/returns.mjs"
import Order from '../../model/orderItemSchema.mjs'



export const newReturn=async (req, res) => {
    const product = await Product.findById(req.query.product);
    const gst=product.gst;
    const discount=product.discount
    try {
        console.log(req.query.couponDiscound);
        const newReturn=new Returns({
            user:req.session._id,
            products:[{
                product:req.query.product,
                quantity:req.query.Quantity,
                amount:(req.query.amount*req.query.Quantity)/100*(100-discount)+(req.query.amount*req.query.Quantity)/100*gst,
                order:req.query.order
            }],
            refundMode:"wallet",
            refundStatus:"pending",
            reason:req.query.reason, 
            description:req.query.description,
        })
        let order=await Order.findById(req.query.order)
        const product = order.products.find(
            (item) => item.product.toString() === req.query.product
          );
        product.orderStatus="Returned";
        const data=await newReturn.save();
        await order.save();
      if(data){
        res.status(201).json({message:"Return created successfully",data:data})
      }
      else{
        res.status(400).json({message:"Failed to create return",data:null})
        }

            
    } catch (error) {
        console.log(error); 
    }

} 
 

export const My_Returns=async(req,res)=>{
    const user = await User.findOne({_id:req.session._id});
    const Return=await Returns.find({user:req.session._id}).populate({
        path: 'products.product',
        select: 'product_name price product_image',
        model: Product,  
        options: { strictPopulate: false },
    }).populate({
        path:'user',
        select:'username email',
        model:User,
        options: { strictPopulate: false },
    })
    try {
        res.render('user/returns.ejs',{user,Return})
    } catch (error) {
        
    }
}