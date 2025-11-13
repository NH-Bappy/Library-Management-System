const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors');
const { globalErrorHandler } = require('./src/utils/globalErrorHandler');






// make a json object

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({origin:["http://localhost:3000"]}))

// route
app.use('/api/v1', require('./src/routes/index.api'));
//global error handling middleWare
app.use(globalErrorHandler)


module.exports = {app}