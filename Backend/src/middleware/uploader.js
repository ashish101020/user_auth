const multer = require('multer');
const path = require('path');

// Filename function to generate a unique name for uploaded files
const filename = (req, file, next) => {
    const lastIndexof = file.originalname.lastIndexOf(".");
    const ext = file.originalname.substring(lastIndexof);  // Correcting to 'substring'
    next(null, `img-${Date.now()}${ext}`);  // Append the extension correctly
};

// Destination function to set the directory for file uploads
const userDestination = (req, file, next) => {
    next(null, path.join(__dirname, '../uploads'));  // Using path.join for cross-platform compatibility
};

// Destination for post images
const postImageDestination = (req, file, next) => {
    next(null, path.join(__dirname, '../uploads/post-images'));  // Using path.join for cross-platform compatibility
};

// Setting up the multer storage for user images
const userUpload = multer({
    storage: multer.diskStorage({
        destination: userDestination,
        filename: filename,
    }),
});

// Setting up the multer storage for post images
const postUpload = multer({
    storage: multer.diskStorage({
        destination: postImageDestination,
        filename: filename,
    }),
});

// Exporting all the functions and instances through module.exports
module.exports = {
    userUpload,
    postUpload
};
