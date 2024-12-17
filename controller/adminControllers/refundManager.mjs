import session from "express-session";
import User from "../../model/userSchema.mjs";
import Product from "../../model/productSchema.mjs";
import Returns from "../../model/returns.mjs"
import Order from '../../model/orderItemSchema.mjs'
import Wallet from '../../model/wallet.mjs'



export const refund = async (req, res) => {
    try {
        const Return = await Returns.findById(req.query.id);
        let order=await Order.findById(Return.products[0].order)
        const product = order.products.find(
            (item) => item.product.toString() === Return.products[0].product.toString()
          );
          console.log("mnssj",product);
          product.orderStatus="Refunded";
          const data=await order.save();
        const amount=Return.products[0].amount;
        if (!Return) {
            return res.status(404).json({ message: "Return not found" });
        }

        let wallet = await Wallet.findOne({ userId: Return.user });

        const transaction = {
            walletAmount: Number(amount),
            orderId: Return.products[0].order,  
            transactionType: "Credited",
            transactionDate: new Date(),
        };
        console.log("object",Return.products[0].order);


        if (!wallet) {
            wallet = new Wallet({
                userId: Return.user,
                balance: 0,
                transactions: [transaction],
            });
        } else {

            wallet.transactions.push(transaction);

            wallet.balance += transaction.walletAmount;
        }


        Return.refundStatus = "Refunded";
        await Return.save();


        await wallet.save();

        res.status(200).json({ message: 'Refund processed successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Refund processing failed' });
    }
};
