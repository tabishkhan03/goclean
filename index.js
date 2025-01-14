require('dotenv').config();
// Connect Mongodb Database
const mongoose = require("mongoose");
const db = require('./config/mongoose');
const MongoStore = require("connect-mongo");
const passport = require('passport');
const flash = require("connect-flash");
const flashmiddleware = require('./config/flash');

// load Express
const express = require("express");
const app = express();
app.use(express.json());

// Set Session and Passport
const session = require('express-session');
app.use(session({
    secret:process.env.SESSION_SECREAT,
    resave: false,
    saveUninitialized: true,
    rolling: true, 
    cookie: {maxAge: 24 * 60 * 60 * 1000},
    store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECTION,
        ttl: 3600,
    }),
}));

// Store User in locals
app.use(function(req, res, next) {
    res.locals.user = req.session.user_id;
    next();
});

// Passport Config
app.use(passport.session());
app.use(passport.initialize());

// Set Flash
app.use(flash())
app.use(flashmiddleware.setflash);

// Setting the static files
const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));

// Set Admin Routes
const adminRoute = require("./routes/adminRoutes");
app.use('/',adminRoute);

// Set API Routes
const apiRoute = require("./routes/apiRoutes");
app.use('/api', apiRoute);

// Set Port and Start Server
app.listen(process.env.PORT,function(){
    console.log("Server is Running  on 8400");
});