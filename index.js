//import express module
var express = require('express');
var parser = require('body-parser');

const db = require('./database');

//create an express app
var app = express();

var ejs = require('ejs');

const path = require('path');
app.use(parser.json());
app.use(express.static('public'));

//prepare our database connection parameters
const databaseData = { 
    host:"localhost",
    user:"root",
    password: "",
    database: "cubicgames",
    port: 3306
};

//add a callback function to handle 
//get request on the root
app.get('/', function(req, res) {
    let data = {
        title: "Cubic Games Studio"
    }
    ejs.renderFile('./html/index.ejs', data, null, function(err, str){
        // str => Rendered HTML string
        res.send(str);
    });
});

app.get('/about', function(req, res) {  
    let data = {
        title: "About Cubic Games"
    }
    ejs.renderFile('./html/about.ejs', data, null, function(err, str){
        // str => Rendered HTML string
        res.send(str);
    });});

app.get('/contact', function(req, res) { 
    let data = {
        title: "Contact Cubic Games"
    } 
    ejs.renderFile('./html/contact.ejs', data, null, function(err, str){
        // str => Rendered HTML string
        res.send(str);
    });});

//this to create the tables insiode our db
//remeber this should be password protected
app.get('/createDB', function(req, res) {  
    //run the create table function
    db.createTables(databaseData, function(err, result){
        //if amy error happend send an error response
        if(err) {
            res.status(400);
            res.end("an error has occured:" + err);
            return;
        }
        //otherwise we created tables successfully
        res.status(200);
        res.end("tables were created successfully");
    });
});

//this function is to handle a new contact request
app.post('/handlecontact', function(req, res){
    
    console.log(req.body);

    //validate the data
    //forename is required
    if(req.body.forename === undefined){
        res.status = 400;
        res.send({message:"forename is required"});
        return;
    }//forename must be at least 2 characters long
    else if(req.body.forename.length < 2){
        res.status = 400;
        res.send({message:"forename is too short"});
        return;
    }

    //surname is required
    if(req.body.surname === undefined){
        res.status = 400;
        res.send({message:"surname is required"});
        return;
    }

    //email is required
    if(req.body.email === undefined){
        res.status = 400;
        res.send({message:"email is required"});
        return;
    }//email should be at least 5 characters long
    else if(req.body.email.length < 5 ){
        res.status = 400;
        res.send({message:"email is too short"});
        return;
    }
    else {
        //email must match a specific pattern for a valid email
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(req.body.email).toLowerCase())){
            res.status = 400;
            res.send({message:"invalid email format"});
            return;
        }
    }
    
    //data validation is correct 
    //connect to database and save the data

    //we need to created an object with fields that matches database fields
    //otherwise we get errors
    const newContact =  {
        forename: req.body.forename,
        surname: req.body.surname,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        dateRecieved: new Date()
    }
    //we are atempting to add a new contact
    //call the addConact function
    db.addContact(databaseData, newContact, function (err, data){
        
        //our response will be a json data
        res.setHeader('content-type', 'application/json')
        res.setHeader('accepts', 'GET, POST')
        //when adding a user is done, this code will run
        //if we got an error informs the client and set the proper response code
        if(err){
            res.status(400);
            res.end("error:" + err);
            return;
        }
        //if no error let's set proper response code and have a party
        res.status(201);
        res.end(JSON.stringify({message:"we recieved your message"}));
    });
   
})

var port = process.env.PORT || 3000;
//run the server on port 3000
app.listen(port, () => {
    console.log("server running on port:" + port);
});
