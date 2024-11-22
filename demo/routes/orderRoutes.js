import { orderDetail } from '../controllers/orderControllers.js'

import express from 'express'
const  orderRouter  = express.Router()


orderRouter.get('/viewOrder',orderDetail)
export default orderRouter; 