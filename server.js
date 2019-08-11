require("dotenv").config();

const nodemailer = require('nodemailer');
const express = require("express");
const keys = require("./keys");


// Sets up the Express App
const app = express();

// no longer needed as express has its own parser now
// const bodyParser = require('body-parser')
// app.use(bodyParser.json()) // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", function(req, res) {
    res.send('<h1>welcome to the interwebs</h1>');
  });

app.post("/email", function(req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    console.log(req.body);
    const name = req.body.name;
    const contact = `${req.body.email ? req.body.email : 'no number'}\n${req.body.phone ? req.body.phone : 'no number'}`;
    const message = `${req.body.message}\nContact Info\n${name}\n${contact}`;
    console.log(name, message);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: keys.gmail.id,
          pass: keys.gmail.secret
        }
      });
      
      var mailOptions = {
        from: 'angeldavisdevelopment@gmail.com',
        to: 'byronanthonybrown@gmail.com',
        subject: 'Messge from portfolio from ' + name,
        text: message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.json(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  
    res.json(true);
  });
  
  // Starts the server to begin listening
  // =============================================================
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });


