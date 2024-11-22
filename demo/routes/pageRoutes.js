
import { homePage ,wishlist,wallet,profile,orderList,orderHistory,address } from '../controllers/pageControllers.js'
import{ isLogout ,isLogin} from '../middlewares/user/userAuth.js'
import express from 'express'
const  pageRouter  = express.Router()

pageRouter.get('/',homePage)

pageRouter.get('/wish-list',isLogin,wishlist)

pageRouter.get('/wallet',isLogin,wallet)

pageRouter.get('/my-profile',isLogin,profile)

pageRouter.get('/my-order',isLogin,orderList)
 
pageRouter.get('/order-history',isLogin,orderHistory)

pageRouter.get('/my-address',isLogin,address)
export default pageRouter;

