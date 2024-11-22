export const isLogin = async (req, res, next) => {
  try {
    
    if (req.session.user_id) {
     
      next();
    } else {
      // User is not logged in, redirect to the login page
      return res.redirect('/login');
    }
  } catch (error) {
    // Log any errors that occur
    console.log(error.message);
  }
};


export const isLogout = async (req,res,next) => {
  try {
      
   if(req.session.user_id){
       res.redirect('/')
   }
   next();

  } catch (error) {
      console.log(error.message);
      
  }
}