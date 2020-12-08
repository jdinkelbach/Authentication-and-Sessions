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
});

app.post("/", async function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    let hashedPassword = "";    // '$2a$10$06ofFgXJ9wysAOzQh0D0..RcDp1w/urY3qhO6VuUJL2c6tzAJPfj6'
    let result = await checkUsername(username);
    console.dir(result);
    
    if (result.length > 0) {
        hashedPassword = result[0].password;
    }
    
    console.log(hashedPassword);
    
    let passwordMatch = await checkPassword(password, hashedPassword);
    console.log("passwordMatch: " + passwordMatch);
    
    if (passwordMatch){
        req.session.authenticated = true;
        res.render("welcome");
    }
    else{
        res.render("index", {loginError: true});
    }
});

app.get("/myAccount", isAuthenticated, function(req, res){
    if (req.session.authenticated){
        res.render("account");
    }
    else{
        res.redirect("/");
    }
    res.render("account");
});

app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/");
}) 

// Middleware function - check if session is authenticated
function isAuthenticated(req, res, next){
    if(!req.session.authenticated){
        res.redirect("/");
    }
    else{
        next();
    }
}

// Create DB connection
function createDBConnection() {
    var conn = mysql.createPool({
        connectionLimit: 10,
        host: "de1tmi3t63foh7fa.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "h6611di0rx1vi59j",
        password: "k7doqa4dxvcsllf2",
        database: "h6b8um36ta9hld0v"
    })
    return conn;
}

// Check if username exists in database and returns corresponding record
function checkUsername(username) {
    let sql = "SELECT * FROM users WHERE username = ?";
    return new Promise(function(resolve, reject) {
        let conn = createDBConnection();
        conn.query(sql, [username], function(err, rows, fields){
            if (err) throw err;
            console.log("Rows found: " + rows.length);
            resolve(rows);
        });
    });
}

// Checks if passsword matches hashed password
function checkPassword(password, hashedValue){
    return new Promise(function(resolve, reject) {
        bcrypt.compare(password, hashedValue, function(err, result){
            console.log("Result: " + result);
            resolve(result);
        });
    });
}

// Listener
app.listen(8080, "0.0.0.0", function(){
    console.log("Running Express Server");
})