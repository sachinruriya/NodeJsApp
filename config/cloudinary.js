// import { v2 as cloudinary } from 'cloudinary';
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



    // Configuration
    cloudinary.config({ 
        cloud_name: 'dxhxb7kzw', 
        api_key: '634753195969112', 
        api_secret: 'xVnwVJwBqYnyjQkqkKzJZyb2FW0' // Click 'View API Keys' above to copy your API secret
    });
    
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
          folder: 'profile_pictures', // Name of the folder where the images will be uploaded
          allowed_formats: ['jpg', 'png'],
          public_id: (req, file) => 'profile_' + Date.now() // Custom name for the uploaded file
        },
      });
      const upload = multer({ storage: storage });

      module.exports = upload;