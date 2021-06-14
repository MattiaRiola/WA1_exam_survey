'use strict';

const express = require('express');
const morgan = require('morgan');
const session = require('express-session'); // session middleware




// init express
const app = new express();
const port = 3001;

const passport = require('passport');
const passportLocal = require('passport-local');

// const task_dao = require('./survey-dao');
const user_dao = require('./user-dao');

app.use(morgan('dev')); //to see server side some logs
app.use(express.json()); //to parse the tasks from string to json


//to install for validating (npm install --save express-validator)
const { body, validationResult, query } = require('express-validator');




// custom middleware: check if a given request is coming from an authenticated user
// simple way could be check req.isAuthenticated() at the beginning of every callback body in each route to protect
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
      // SE SONO AUTENTICATO POSSO PROCEDERE A CHIAMARE LA FUNZIONE CHE SEGUE, CHE SARA' IL CORPO DELLE RICHIESTE GET/POST
      return next();
  // altrimenti ritorno l'errore e non proseguo al prossimo middleware
  return res.status(401).json({ error: 'not authenticated' });
}

// initialize and configure HTTP sessions
app.use(session({
  secret: 'This is the secret used for HTTP sessions, I can write there anything I want',
  resave: false,
  saveUninitialized: false
}));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

//to install for validating (npm install --save express-validator)
// const { body, validationResult, query } = require('express-validator');



/************ API *************/

app.get('/', (req, res) => {
  res.send('Hello World, from your server');
});










// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});