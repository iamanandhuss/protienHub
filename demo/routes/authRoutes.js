import  { loginPage,signupPage,otpPage,authSuccess,postSignup,verifyLogin,logOut} from '../controllers/authControllers.js'
import { isLogin,isLogout} from '../middlewares/user/userAuth.js'
import User from '../models/user/userSchema.js'


import express from 'express'
const  router  = express.Router()



router.get("/login",loginPage) 

router.post('/login',verifyLogin)

router.get('/log-out', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error in logging out.');
        }
        res.redirect('/login'); // Redirect the user to the login page after logging out
    });
});
router.post("/login",async(req,res)=>
{
    try {
        const {userName,password} = req.body
        const  user = await Users.findById(userId);        
        if(password==user.password)
        {
            req.session.req.session.user_id=user.user_id;
            res.redirect('/login');
        }
    } catch (error) {
        
    }
   
})
router.get("/signup",signupPage)

router.post("/signup",postSignup)
router.get("/otp",otpPage)

// router.post('/verified',otpverify)

router.post('/authSuccess',authSuccess)



export default router; 
 