const express = require('express');
const _ = express.Router();
const libraryController = require('../../controller/library.controller')
const upload = require('../../middleware/multer.middleware')

_.route('/library-create').post(upload.fields([{ name:"coverImage" , maxCount: 10}]), libraryController.createLibrary);
_.route('/all-book').get(libraryController.findAllBook);

module.exports = _ ;