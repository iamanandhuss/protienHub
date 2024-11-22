import { paymentPage,orderSucess } from '../controllers/paymentController.js'
import express from 'express'
const  paymentRouter  = express.Router()


paymentRouter.get('/payment',paymentPage)
paymentRouter.get('/orderSucess',orderSucess)

export default paymentRouter; 