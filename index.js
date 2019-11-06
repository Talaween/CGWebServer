//import express module
var express = require('express');
var parser = require('body-parser');

//create an express app
var app = express();

const path = require('path');
app.use(parser.json());
app.use(express.static('public'));

//add a callback function to handle 
//get request on the root
app.get('/', function(req, res) {  
    res.sendFile(path.join(__dirname+'/html/index.html'));
});

app.get('/about', function(req, res) {  
    res.sendFile(path.join(__dirname+'/html/about.html'));
});

app.get('/contact', function(req, res) {  
    res.sendFile(path.join(__dirname+'/html/contact.html'));
});

app.post('/handlecontact', function(req, res){
    //console.log(req.body);

    //validate the data

    //connect to database and save the data

    //send the message toi company email
    res.status = 201;
    res.send({message:"we recieved your message"});
})

var port = process.env.PORT || 3000;
//run the server on port 3000
app.listen(port);
