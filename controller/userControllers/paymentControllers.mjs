import session from 'express-session';
import { razorpayInstance } from '../../services/razorpay.mjs'


export const paymentRender=async(req,res)=>{
    try {
        const orderAmount=req.session.amount;
        const instance = razorpayInstance;

        const options={ 
            amount:orderAmount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        }

        instance.orders.create(options, (error, order) => {
            if (error) {
              console.error("Failed to create order:", error);
              return res
                .status(500)
                .json({ error: `Failed to create oreder : ${error.message}` });
            }
            console.log(order.id);
            return res.status(200).json({ orderId: order.id });
          });
    } catch (error) {
        console.error("Error order in checkout : ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}