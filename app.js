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

// For parsing post parameters
app.use(express.urlencoded({extended: true}));

// Routes
app.get("/", function(req, res){
    res.render("index");
})

app.post("/", function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    console.log("username: " + username);
    console.log("password: " + password);
    if (username == "admin" && password == "admin"){
        res.send("Right credentials");
    }
    else{
        res.render("index");
    }
})

// Listener
app.listen(8080, "0.0.0.0", function(){
    console.log("Running Express Server");
})