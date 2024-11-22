import express from 'express';
const userRouter = express.Router();
 
import {getSignUp,signupPost,getOtp,postOtp,getSuccess,getLogin,postLogin,resendOtp,logout,forgetPassword,verifie_email,
    resetOpt,get_Otp,newPassword,password_update,googleAuth,googleAuthCallback}
 from '../controller/userControllers/userAuth.mjs'
import {homepage} from '../controller/userControllers/userControllers.mjs'
import {profile,editProfile} from '../controller/userControllers/profileControllers.mjs'
import {orderDetails,orderDetail,addToOrder,addOrderAddress,paymentMethod,orderSucess,paymentDetails,my_order,cancelOrder} from '../controller/userControllers/orderControllers.mjs'
import {viewCart,Cart,removeItem} from '../controller/userControllers/cartControllers.mjs' 
import {addresspage,addAddressPage,insertAddress,editAddress,insertEdited,deleteAddress} from '../controller/userControllers/addressControllers.mjs'
import {viewdetail,allProduct,sortproducts,addRatting} from '../controller/userControllers/productControllers.mjs'
import {isLoggedIn,isLoggedOut,isBlocked} from '../middleware/user/userAuth.mjs'

import User from '../model/userSchema.mjs';



//to the SignUp 
userRouter.get('/SignUp',isLoggedOut,getSignUp)

userRouter.post('/signup',isLoggedOut,signupPost)
//to the otp page
userRouter.get('/otp',isLoggedOut,getOtp)
userRouter.post('/authSuccess',isLoggedOut,postOtp)
//sucesspage
userRouter.get('/authSuccess',isLoggedOut,getSuccess) 
//to login page
userRouter.get('/login',isLoggedOut,getLogin)
userRouter.post('/login',isLoggedOut,postLogin)
 

userRouter.get('/auth/google',isLoggedOut, googleAuth);
userRouter.get('/auth/google/callback',isLoggedOut, googleAuthCallback);

//logout the session  
userRouter.get('/log-out',isLoggedIn,logout)
//resend otp
userRouter.get('/Resend',isLoggedOut,resendOtp)
//resetOtp
userRouter.get('/resetOpt',isLoggedOut,resetOpt)
userRouter.post('/create_password',isLoggedOut,get_Otp)
userRouter.get('/newPassword',isLoggedOut,newPassword)
userRouter.post('/password_update',isLoggedOut,password_update)






// to home page
userRouter.get('/',isLoggedIn,isBlocked,isLoggedIn,homepage)
//products details
userRouter.get('/viewdetail',isBlocked,isLoggedIn,viewdetail)
userRouter.get('/allProduct',isBlocked,isLoggedIn,allProduct)
userRouter.get('/sort-products',isBlocked,isLoggedIn, sortproducts);



///to user profile
userRouter.get('/my-profile',isBlocked,isLoggedIn,profile)
userRouter.post('/editProfile',isBlocked,isLoggedIn,editProfile)
//to the orderlist page  
userRouter.get('/my-order',isBlocked,isLoggedIn,orderDetails) 
//to the address page 
userRouter.get('/my-address',isBlocked,isLoggedIn,addresspage)
userRouter.get('/addAddress',isBlocked,isLoggedIn,addAddressPage)
userRouter.post('/addAddress',isBlocked,isLoggedIn,insertAddress)
userRouter.get('/EditAddress/:addressId',isBlocked,isLoggedIn,editAddress)
userRouter.post('/editAddress/:addressId',isBlocked,isLoggedIn,insertEdited)
userRouter.delete('/DeleteAddress/:addressId',isBlocked,isLoggedIn,deleteAddress);
 
  
userRouter.get('/forgotPassword',isBlocked,isLoggedIn,forgetPassword)
userRouter.post("/verifie_email",isLoggedIn,verifie_email)

//cart page 
userRouter.get('/viewCart',isBlocked,isLoggedIn,viewCart)
userRouter.get('/Cart',isBlocked,isLoggedIn,Cart)
userRouter.get("/removeItem/:productId",isBlocked,isLoggedIn,removeItem)

 
//payment details
userRouter.get('/payment',isBlocked,isLoggedIn,paymentDetails)

//order
userRouter.post('/addToOrder',addToOrder) 
userRouter.get('/viewOrderAddress/:orderId',isBlocked,isLoggedIn,orderDetail)
userRouter.post('/addOrderAddress',addOrderAddress)
userRouter.post('/paymentMethod',isBlocked,isLoggedIn,paymentMethod)
userRouter.get('/orderSucess',isBlocked,isLoggedIn,orderSucess)
userRouter.get('/my_order',my_order)
userRouter.post('/cancel_Order',cancelOrder)
userRouter.post('/addRatting',addRatting)

  


export default userRouter; 