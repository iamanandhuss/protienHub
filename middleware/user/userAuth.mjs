import session from 'express-session';
import User from '../../model/userSchema.mjs';

// isLoggedIn Middleware - ensures the user is logged in
export const isLoggedIn = (req, res, next) => {
  if (req.session._id) {
    // If the session has a user, the user is logged in
    return next(); // Continue to the next middleware or route handler
  } else {
    // If not logged in, redirect to login page
    return res.redirect('/login');
  }
}

// isLoggedOut Middleware - ensures the user is logged out
export const isLoggedOut = (req, res, next) => {
 try {
   if (req.session._id) {
 
     // If the user is logged in, redirect them to their dashboard
     return res.redirect('/');
   } else {
     // If the user is logged out, continue to the next middleware or route handler
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