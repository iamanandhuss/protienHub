import { adminLogin,adminAuth } from  '../../controllers/admin/adminLogin.js'

import express from 'express'
const  adminRouter  = express.Router()



adminRouter.get('/admin',adminLogin)
adminRouter.post('/admin_login',adminAuth)



export default adminRouter;