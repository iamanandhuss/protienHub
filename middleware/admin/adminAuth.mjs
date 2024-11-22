import session from 'express-session';

// isLoggedIn Middleware - ensures the user is logged in
export const is_adminLogedin = (req, res, next)=> {
  if (req.session.adminEmail) {
    // If the session has a user, the user is logged in
    return next(); // Continue to the next middleware or route handler
  } else {
    // If not logged in, redirect to login page
    return res.redirect('/admin/login');
  }
} 

// isLoggedOut Middleware - ensures the user is logged out
export const is_adminLogedOut = (req, res, next)=> {
  if (req.session.adminEmail) {
    
    // If the user is logged in, redirect them to their dashboard
    return res.redirect('/admin/dashboard');
  } else {
    // If the user is logged out, continue to the next middleware or route handler
    return next();
  }
}