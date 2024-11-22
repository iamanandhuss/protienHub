 import { productDetail,viewCart,Cart } from '../controllers/cartControllers.js'

import express from 'express'
const  cartRout  = express.Router()

cartRout.get('/addCart', productDetail);
cartRout.get('/viewCart',viewCart)
cartRout.get('/Cart',Cart)


export default cartRout; 