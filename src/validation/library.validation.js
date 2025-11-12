const Joi = require("joi");
const mongoose = require("mongoose");
const { CustomError } = require("../utils/customError");

// ✅ Joi Validation Schema — only required fields
const bookValidationSchema = Joi.object({
    title: Joi.string().trim().required().messages({
        "string.empty": "Book title cannot be empty.",
        "any.required": "Book title is required.",
    }),
    author: Joi.string().trim().required().messages({
        "string.empty": "Author name cannot be empty.",
        "any.required": "Author name is required.",
    }),
    isbn: Joi.string().trim().required().messages({
        "string.empty": "ISBN code cannot be empty.",
        "any.required": "ISBN code is required.",
    }),
    // Optional fields
    publisher: Joi.string().trim().allow("", null),
    description: Joi.string().trim().allow("", null),
    totalCopies: Joi.number().min(0).default(1),
    availableCopies: Joi.number().min(0).default(1),
    borrowedCount: Joi.number().min(0).default(0),
    isAvailable: Joi.boolean().default(true),
},
    {
        allowUnknown: true,
    });


// ✅ Main function for validation
exports.validateBook = async (req) => {
    try {
        const data = await bookValidationSchema.validateAsync(req.body);

        // optional: check for image upload
        const acceptedMimeTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
        ];
        const maxFileSize = 15 * 1024 * 1024; // 15MB
        const files = req?.files?.coverImage;

        if (files && files.length > 0) {
            for (const file of files) {
                if (!acceptedMimeTypes.includes(file.mimetype)) {
                    throw new CustomError(400, `Invalid image format: ${file.originalname}`);
                }
                if (file.size > maxFileSize) {
                    throw new CustomError(400, `Image is too large: ${file.originalname}`);
                }
            }
        }

        return { ...data, coverImage: files };
    } catch (error) {
        console.error("Book Validation Error:", error);
        throw new CustomError(401, error.details?.[0]?.message || error.message);
    }
};
