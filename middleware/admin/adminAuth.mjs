import session from 'express-session';

export const is_adminLogedin = (req, res, next)=> {
  if (req.session.adminEmail) {
    return next(); 
  } else {
    return res.redirect('/admin/login');
  }
} 

export const is_adminLogedOut = (req, res, next)=> {
  if (req.session.adminEmail) {
    
    return res.redirect('/admin/dashboard');
  } else {
    return next();
  }
}