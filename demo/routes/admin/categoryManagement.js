
import { blockcategory,unblockcategory,addCategory,add_category } from  '../../controllers/admin/categoryManagement.js'
import express from 'express'
import bodyParser from 'body-parser';
const  categoryManager  = express.Router()


categoryManager.get('/blockcategory/:id', blockcategory);
categoryManager.get('/unblockcategory/:id', unblockcategory);
categoryManager.get('/addCategory', addCategory);
categoryManager.post('/add_category',add_category)

export default categoryManager;