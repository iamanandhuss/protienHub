import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv"
dotenv.config()

export const razorpayInstance=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})