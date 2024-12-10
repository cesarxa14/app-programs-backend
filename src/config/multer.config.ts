import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
        folder: 'uploads', // Carpeta en Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'], // Extensiones permitidas
      }
    }

});

export const upload = multer({ storage });
