// export const auth = async (req, res, next) => {
//     try {
//       if (req.session.admin) {
//         // Proceed if the admin is authenticated
//       } else {
//         res.redirect('/admin/login'); // Redirect to login if not authenticated
//       }
//       next(); // Call the next middleware
//     } catch (error) {
//       console.log(error.message);
//       res.status(500).send('Internal Server Error');
//     }
//   };
  