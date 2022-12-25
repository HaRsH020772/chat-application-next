const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
require('dotenv').config();

//? Regular middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//? cors set-up
app.use(cors());

//? Logger middleware
app.use(morgan('tiny'));

//? Handling the routers
const user = require('./routes/userRoutes');

app.use('/auth',user);


module.exports = app;

