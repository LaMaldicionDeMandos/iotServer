require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');

const authRouter = require('./routes/auth');

const USE_WHITE_LIST = process.env.USE_CORS_ORIGIN_WHITE_LIST === 'true';

var app = express();

app.use(logger('dev'));
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);

module.exports = app;
