import {add_product,blockproduct,unblockproduct } from  '../../controllers/admin/productManagement.js'
import express from 'express'
import bodyParser from 'body-parser';
const  productManager  = express.Router()

productManager.get('/productManager',add_product)
productManager.get('/unblockproduct/:id', blockproduct);
productManager.get('/blockproduct/:id', unblockproduct);

export default productManager;