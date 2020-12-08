// Include required packages
const express = require("express");
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

// Use ejs as templating engine
app.set('view engine', 'ejs');

// Set parameters for sessions
app.use(session({
    secret: "top secret",
    resave: true,
    saveUninitialized: true
}));

// routes
app.get("/", function(req, res){
    res.send("Login form will go here!");
})

// listener
app.listen(8080, "0.0.0.0", function(){
    console.log("Running Express Server");
})