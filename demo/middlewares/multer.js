// import multer from 'multer';
// import path from 'path';

// // Set up storage for images
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../public/uploads')); // Ensure this directory exists
//     },
//     filename: (req, file, cb) => {
//         // Create a unique filename using the timestamp and original name
//         const name = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`; // Replace spaces with hyphens
//         cb(null, name);
//     }
// });

// // Create upload middleware for multiple files
// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB (optional)
//     fileFilter: (req, file, cb) => {
//         const filetypes = /jpeg|jpg|png|gif/; // Acceptable file types
//         const mimetype = filetypes.test(file.mimetype);
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//         if (mimetype && extname) {
//             cb(null, true);
//         } else {
//             cb(new Error(`Error: File upload only supports the following filetypes - ${filetypes}`));
//         }
//     }
// });

// export default upload;
