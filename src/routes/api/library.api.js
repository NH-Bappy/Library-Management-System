const express = require('express');
const _ = express.Router();
const libraryController = require('../../controller/library.controller')
const upload = require('../../middleware/multer.middleware')

_.route('/library-create').post(upload.fields([{ name:"coverImage" , maxCount: 10}]), libraryController.createLibrary);
_.route('/all-book').get(libraryController.findAllBook);
_.route("/find-target-book/:slug").get(libraryController.findSingleBook);
_.route('/update-book/:slug').put(libraryController.updateBook);
_.route("/delete-book/:slug").delete(libraryController.deleteBook);

module.exports = _ ;