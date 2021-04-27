require('dotenv').config();

const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const keys = require('./keys');


// Sets up the Express App
const app = express();

app.use(cors())

// no longer needed as express has its own parser now
// const bodyParser = require('body-parser')
// app.use(bodyParser.json()) // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.send('<h1>welcome to the interwebs</h1>');
  });

app.post('/email', function(req, res) {
    console.log('in the email endpoint')
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    // console.log(req.body);
    const name = req.body.name;
    const contact = `${req.body.email ? req.body.email : 'no email'}\n${req.body.phone ? req.body.phone : 'no number'}`;
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
          res.json('success: email sent');
        }
      });
  
  });
  
app.post('/rsvp', function(req, res) {
  console.log('in the rsvp endpoint')
  
  // expected body
  // expected = {
  //   info: 'test guest',
  // }

  // const name = req.body.name;
  const info = req.body.info;

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: keys.gmail.id,
        pass: keys.gmail.secret
      }
    });
    
    var mailOptions = {
      from: 'angeldavisdevelopment@gmail.com', // this is the low security email we set up
      to: 'royals1stBirthday@gmail.com', // this is the email we want to send to
      subject: 'party confirmation',
      text: info
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.json(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.json('email Sent');
      }
    });

});
  
  // Starts the server to begin listening
  // =============================================================
  app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
  });


