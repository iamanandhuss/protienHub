
import { blockUser,unblockUser,viewUser } from  '../../controllers/admin/userManagement.js'
import express from 'express'
const  userManage  = express.Router()


userManage.get('/blockUser/:id', blockUser);
userManage.get('/unblockUser/:id', unblockUser);
userManage.get('/viewUser', viewUser);

export default userManage;