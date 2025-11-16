const { uploadFileInCloudinary, getPublicId, removeCloudinaryFile } = require('../helpers/cloudinary');
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
//@ update Book information without image

exports.updateBook = asyncHandler(async(req ,res) => {
    const { slug } = req.params
    if (!slug) throw new CustomError(401, "slug is missing");
    const updateBookInfo = await libraryModel.findOneAndUpdate({slug} , {...req.body} ,{new: true})
    if(!updateBookInfo) throw new CustomError(401 , "your book information not updated")
    apiResponse.sendSuccess(res, 200, "successfully update your info", updateBookInfo)
});





// @desc delete library
exports.deleteBook = asyncHandler(async (req , res) => {
    const {slug} = req.params;
    if(!slug) throw new CustomError(401 , "slug is missing");
    
    const libraryInfo = await libraryModel.findOne({slug})
    if(!libraryInfo) throw new CustomError(401 , "library information not found")

    // delete cover image
    if (libraryInfo.coverImage) {
        const public_id = getPublicId(libraryInfo.coverImage);
        if (public_id) await removeCloudinaryFile(public_id);
    }

    const deleteLibraryBook = await libraryModel.findOneAndDelete({slug})
    if (!deleteLibraryBook) throw new CustomError(400 , "bad request")
    apiResponse.sendSuccess(res, 200, "successfully deleted book", deleteLibraryBook)
});










