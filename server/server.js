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






/*****************************************************************************************/
/**
 * USER'S API
 */

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
      if (err)
          return next(err);
      if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
          if (err)
              return next(err);

          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser()
          return res.json(req.user);
      });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
      res.status(200).json(req.user);
  }
  else
      res.status(401).json({ error: 'Unauthenticated user!' });
});


// If i get here, it is an unknown route
// Ref: https://stackoverflow.com/questions/11500204/how-can-i-get-express-js-to-404-only-on-missing-routes
app.use(function (req, res) {
  res.status(404).json({error: 'Not found!'});
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});