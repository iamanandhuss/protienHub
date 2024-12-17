import session from 'express-session';
import Coupon from '../../model/couponSchema.mjs'
import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs'
import Order from '../../model/orderItemSchema.mjs'
import ProteinHubContent from '../../model/ProteinHub.mjs'
import Carts from '../../model/cartSchema.js'
import Wallet from '../../model/wallet.mjs'

export const wallet = async(req,res)=>{
    const page = parseInt(req.query.page) || 1; 
      const limit = parseInt(req.query.limit) || 6; 
      const skip = (page - 1) * limit;
      const totaltransaction = 20;
      const totalPages = Math.ceil( 5 / limit);  


    const user = await User.findOne({_id:req.session._id});
    let wallet = await Wallet.findOne({ userId: req.session._id }).skip(skip)
    .limit(limit);;
    try {
        res.render('user/userWallet.ejs',{user,wallet,totalPages,
            currentPage: page, // Add currentPage here
            limit})
    } catch (error) {
         
    }
} 

export const walletDebit = async (req, res) => {
    try {
        const userId = req.session._id;
        const { orderId, amount } = req.query;

        if (!userId || !orderId || !amount) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        let wallet = await Wallet.findOne({ userId });
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.paymentMode = "wallet";
        order.paymentStatus = "Paid";

        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        const debitAmount = Number(amount)*-1;

        if (wallet.balance < debitAmount) {
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        const transaction = {
            walletAmount: debitAmount,
            orderId,
            transactionType: "Debited",
            transactionDate: new Date(),
        };

        wallet.transactions.push(transaction);
        wallet.balance -= debitAmount;

        await wallet.save();
        await order.save();

        return res.status(200).json({
            message: "Wallet debited and payment successful",
            walletBalance: wallet.balance,
            transaction,
        });
    } catch (error) {
        console.error("Error in walletDebit:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
