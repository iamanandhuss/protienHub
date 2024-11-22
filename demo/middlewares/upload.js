// import multer from 'multer';
// import path from 'path';

// // Multer Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(path.resolve(), 'public/categoryImages')); // Set the upload directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// // File Filter
// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//   }
// };

// const upload = multer({
//   storage, 
//   fileFilter,
//   limits: { fileSize: 1024 * 1024 * 2 } // Max 2MB
// });

// export default upload;
