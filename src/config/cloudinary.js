// // import { CloudinaryStorage } from "multer-storage-cloudinary";
// // import { diskStorage } from "multer";
// // import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";
// dotenv.config();

// cloudinary.config({
//   cloud_name: "dfl3qnj7z",
//   api_key: "986136777597327",
//   api_secret: "aX9n2_oS9-3vpgR7REKzhzMFwNg",
// });

// const uploads = (file, folder) => {
//   return new Promise((resolve) => {
//     uploads.uploader.upload(file, (result) => {
//       resolve(
//         {
//           url: result.url,
//           id: result.public_id,
//         },
//         {
//           resource_type: "auto",
//           folder: folder,
//         }
//       );
//     });
//   });
// };

// export default uploads;

// cloudinary.

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
}); 

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "quizzes",
  },
});

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     console.log(file.mimetype);
//     cb({ message: "Un file format" }, false);
//   }
// };

const uploadCloud = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 },
  // fileFilter: fileFilter,
});

// const uploadCloud = multer({
//   storage,
//   limits: {
//     fileSize: 1000000,
//   },

// });
export default uploadCloud;
