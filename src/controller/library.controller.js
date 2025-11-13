const libraryModel = require('../models/Library.model');
const { asyncHandler } = require('../utils/asyncHandler');
const { validateBook } = require('../validation/library.validation');



// create library management System

exports.createLibrary = asyncHandler(async (req , res) => {
    const value = await validateBook(req);
    console.log(value)
})