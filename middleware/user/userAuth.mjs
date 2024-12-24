import session from 'express-session';
import User from '../../model/userSchema.mjs';

export const isLoggedIn = (req, res, next) => {
  if (req.session._id) {
    return next(); 
  } else {
    return res.redirect('/login');
  }
}

export const isLoggedOut = (req, res, next) => {
 try {
   if (req.session._id) {
 
     return res.redirect('/');
   } else {
     return next();
   }
 } catch (error) {
  console.log(error);
  return res.status(500).send("error"); 
}
}

export const isBlocked = async (req, res, next) => {
 try {
   const user = await User.findOne({_id:req.session._id});
   if(!user.is_blocked) 
   {
     return next(); 
   }
   req.session._id=null;
   res.redirect('/login')
 } catch (error) {
  console.log(error);
 }
} 