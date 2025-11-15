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
});

// get all the data
exports.findAllBook = asyncHandler(async(req ,res) => {
    const AllBook = await libraryModel.find().sort({ createdAt: -1 })
    if (!AllBook) throw new CustomError(404 ,"book not found");
    apiResponse.sendSuccess(res, 200, "successfully found all the book", AllBook)
});

// get target book

exports.findSingleBook = asyncHandler(async (req, res) => {
    const { slug } = req.params
    if (!slug) throw new CustomError(401, "slug is missing")
    const targetBook = await libraryModel.findOne({ slug })
    if (!targetBook) throw new CustomError(404, "book not found");
    apiResponse.sendSuccess(res, 200, "successfully found all the book", targetBook)
});
//@desc update library

exports.updateLibrary = asyncHandler(async(req ,res) => {
    const { slug } = req.params
    if (!slug) throw new CustomError(401, "slug is missing");

});





// @desc delete library
exports.deleteLibrary = asyncHandler(async (req , res) => {
    const {slug} = req.params;
    if(!slug) throw new CustomError(401 , "slug is missing");
    
});










