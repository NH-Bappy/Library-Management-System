const express = require('express');
const _ = express.Router();


_.use('/library' ,require('../routes/api/library.api'))

module.exports = _ ;