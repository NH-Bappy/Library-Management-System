const { uploadFileInCloudinary } = require('../helpers/cloudinary');
const libraryModel = require('../models/Library.model');
const { apiResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { CustomError } = require('../utils/CustomError');
const { validateBook } = require('../validation/library.validation');



// create library management System

exports.createLibrary = asyncHandler(async (req , res) => {
    const value = await validateBook(req);
    // console.log(value)
    // console.log(value?.coverImage?.[0]?.path);
    const uploadImage = await uploadFileInCloudinary(value?.coverImage?.[0]?.path)
    if (!uploadImage) throw new CustomError(500, "your URL is missing or some wrong with your image or database")
    const library = await libraryModel.create({ ...value, coverImage: uploadImage });
    if (!library) throw new CustomError(401, "brand not created");
    apiResponse.sendSuccess(res, 200, "successfully created", library)
})