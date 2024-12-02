import session from "express-session";
import User from "../../model/userSchema.mjs";
import Product from "../../model/productSchema.mjs";
import Returns from "../../model/returns.mjs"
import Order from '../../model/orderItemSchema.mjs'
import Wallet from '../../model/wallet.mjs'



export const refund = async (req, res) => {
    try {
        const Return = await Returns.findById(req.query.id);
        if (!Return) {
            return res.status(404).json({ message: "Return not found" });
        }

        let wallet = await Wallet.findOne({ userId: Return.user });

        const transaction = {
            walletAmount: 100,
            orderId: "order123",
            transactionType: "Credited",
            transactionDate: new Date(),
        };


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
