const fs = require('fs');
const { CustomError } = require('../utils/customError');
const cloudinary = require('cloudinary').v2;
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// @desc upload file in cloudinary
exports.uploadFileInCloudinary = async (imagePath) => {
    try {
        const image = await cloudinary.uploader.upload(imagePath, {
            resource_type: "image"
        });

        const URL = cloudinary.url(image.public_id , {
            fetch_format: "auto",
            quality: "auto"
        });
        // Remove local file after upload
        fs.unlinkSync(imagePath)
        return URL;
    } catch (error) {
        console.error("error from cloudinary file upload", error);
        throw new CustomError(401, error.message);
    }
}

// @desc delete cloudinary Image

exports.removeCloudinaryFile = async (publicId) => {
    try {
        const removeImage = await cloudinary.uploader.destroy(publicId);
        return removeImage.result
        // Cloudinary returns an object like { result: 'ok' } if deletion succeeds.
        // So we check if result === 'ok' to confirm the file was successfully deleted.
    } catch (error) {
        console.log("error from cloudinary file delete", error);
        throw new CustomError(400, error.message)
    }
};

//@desc extract public id
exports.getPublicId = (imageUrl) => {
    const parts = imageUrl.split("/");
    const cloudinaryPublicUrl = parts[parts.length - 1];
    return cloudinaryPublicUrl.split('?')[0]; 
}