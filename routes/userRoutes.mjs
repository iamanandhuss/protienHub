import express from 'express';
const userRouter = express.Router();

import {
    getSignUp, signupPost, getOtp, postOtp, getSuccess, getLogin, postLogin, resendOtp, logout, forgetPassword, verifie_email,
    resetOpt, get_Otp, newPassword, password_update, googleAuth, googleAuthCallback
}
    from '../controller/userControllers/userAuth.mjs'
import { homepage } from '../controller/userControllers/userControllers.mjs'
import { profile, editProfile } from '../controller/userControllers/profileControllers.mjs'
import { orderDetails, orderDetail, addToOrder, addOrderAddress, paymentMethod, orderSucess, paymentDetails, my_order, cancelOrder, orderRevQty,paymentRender,OrderListPay} from '../controller/userControllers/orderControllers.mjs'
import { viewCart, Cart, removeItem, reverseQty,updateQty } from '../controller/userControllers/cartControllers.mjs'
import { addresspage, addAddressPage, insertAddress, editAddress, insertEdited, deleteAddress } from '../controller/userControllers/addressControllers.mjs'
import { viewdetail, allProduct, sortproducts, addRatting ,searchProducts,searchedProducts} from '../controller/userControllers/productControllers.mjs'
import { isLoggedIn, isLoggedOut, isBlocked } from '../middleware/user/userAuth.mjs'
import { addToFav, wishList, removeFromFav } from '../controller/userControllers/favoritesControllers.mjs'
import {newReturn,My_Returns} from '../controller/userControllers/returnControllers.mjs'
import {coupon,addCoupon,removeCoupon,couponWiseProduct} from '../controller/userControllers/couponControllers.mjs'
import {} from '../controller/userControllers/paymentControllers.mjs'
import {wallet,walletDebit} from '../controller/userControllers/walletController.mjs'
import { generateOrderPDF } from '../controller/userControllers/pdfController.mjs'

import User from '../model/userSchema.mjs';


 
//to the SignUp 
userRouter.get('/SignUp', isLoggedOut, getSignUp)

userRouter.post('/signup', isLoggedOut, signupPost)
//to the otp page
userRouter.get('/otp', isLoggedOut, getOtp)
userRouter.post('/authSuccess', isLoggedOut, postOtp)
//sucesspage
userRouter.get('/authSuccess', isLoggedOut, getSuccess)
//to login page
userRouter.get('/login', isLoggedOut, getLogin)
userRouter.post('/login', isLoggedOut, postLogin)


userRouter.get('/auth/google', isLoggedOut, googleAuth);
userRouter.get('/auth/google/callback', isLoggedOut, googleAuthCallback);

//logout the session   
userRouter.get('/log-out', isLoggedIn, logout)
//resend otp
userRouter.get('/Resend', isLoggedOut, resendOtp)
//resetOtp
userRouter.get('/resetOpt', isLoggedOut, resetOpt)
userRouter.post('/create_password', isLoggedOut, get_Otp)
userRouter.get('/newPassword', isLoggedOut, newPassword)
userRouter.post('/password_update', isLoggedOut, password_update)

 




 
// to home page
userRouter.get('/', isLoggedIn, homepage)
//products details
userRouter.get('/viewdetail', isLoggedIn, viewdetail)
userRouter.get('/allProduct', isLoggedIn, allProduct)
userRouter.get('/sort-products', isLoggedIn, sortproducts);
userRouter.get('/search',searchProducts)
userRouter.get('/searchedProducts',searchedProducts)



///to user profile
userRouter.get('/my-profile', isLoggedIn, profile)
userRouter.post('/editProfile', isLoggedIn, editProfile)
//to the orderlist page  
userRouter.get('/my-order', isLoggedIn, orderDetails)
//to the address page 
userRouter.get('/my-address', isLoggedIn, addresspage)
userRouter.get('/addAddress', isLoggedIn, addAddressPage)
userRouter.post('/addAddress', isLoggedIn, insertAddress)
userRouter.get('/EditAddress/:addressId', isLoggedIn, editAddress)
userRouter.post('/editAddress/:addressId', isLoggedIn, insertEdited)
userRouter.delete('/DeleteAddress/:addressId', isLoggedIn, deleteAddress);


userRouter.get('/forgotPassword', isLoggedOut, forgetPassword)
userRouter.post("/verifie_email", isLoggedOut, verifie_email) 

//cart page 
userRouter.get('/viewCart', isLoggedIn, viewCart)
userRouter.get('/Cart', isLoggedIn, Cart)
userRouter.get("/removeItem/:productId", isLoggedIn, removeItem)
userRouter.get("/reverseQty", isLoggedIn, reverseQty)
userRouter.put("/updateQty", isLoggedIn, updateQty)


//payment details
userRouter.get('/payment', isLoggedIn, paymentDetails)
 
//order
userRouter.post('/addToOrder', isLoggedIn, addToOrder)
userRouter.get('/viewOrderAddress/:orderId', isLoggedIn, orderDetail)
userRouter.post('/addOrderAddress', isLoggedIn, addOrderAddress)
userRouter.post('/paymentMethod', isLoggedIn, paymentMethod)
userRouter.get('/orderSucess', isLoggedIn, orderSucess)
userRouter.get('/my_order', my_order)
userRouter.post('/cancel_Order', isLoggedIn, cancelOrder)
userRouter.post('/addRatting', isLoggedIn, addRatting)
userRouter.get('/orderRevQty', isLoggedIn, orderRevQty)
userRouter.post('/paymentRender', isLoggedIn,paymentRender)


//addToFav
userRouter.get('/addToFav', isLoggedIn, addToFav)
userRouter.get('/wishList', isLoggedIn, wishList)
userRouter.post('/favRemoveItem', isLoggedIn, removeFromFav)


//returns
userRouter.post('/returnProduct', isLoggedIn,newReturn)
userRouter.get('/My_Returns', isLoggedIn,My_Returns)

//coupons
userRouter.get('/coupons', isLoggedIn, coupon)
userRouter.get('/data', isLoggedIn,addCoupon)
userRouter.get('/removeCoupon', isLoggedIn,removeCoupon)
userRouter.get('/couponWiseProduct', isLoggedIn,couponWiseProduct)
userRouter.get('/payNow', isLoggedIn,OrderListPay)
// wallet
userRouter.get('/wallet', isLoggedIn,wallet)
userRouter.post('/walletDebit', isLoggedIn,walletDebit)

// generate pdf
userRouter.post('/generatePdf', isLoggedIn,generateOrderPDF)




export default userRouter; 