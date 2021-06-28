'use strict';

const express = require('express');
const morgan = require('morgan');
const session = require('express-session'); // session middleware



const app = express();
const port = 3001;

const passport = require('passport');
const passportLocal = require('passport-local');

// const task_dao = require('./task-dao');
const user_dao = require('./user-dao');
const survey_dao = require('./survey-dao');


// initialize and configure passport
passport.use(new passportLocal.Strategy((username, password, done) => {
    // verification callback for authentication
    user_dao.getUser(username, password).then(user => {
        if (user)
            done(null, user);
        else
            done(null, false, { message: 'Username or password wrong' });
    }).catch(err => {
        done(err);
    });
}));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
// This is so powerful because now we can access data stored in the db for the current user, simply writing req.user
// I have to write another api to make frontend able to user the same information: this api is app.get('/api/sessions/current'
passport.deserializeUser((id, done) => {
    user_dao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});



app.use(morgan('dev')); //to see server side some logs
app.use(express.json()); //to parse the tasks from string to json


// custom middleware: check if a given request is coming from an authenticated user
// simple way could be check req.isAuthenticated() at the beginning of every callback body in each route to protect
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        //if I'm logged in the next callback will be called ( GET/POST )
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
const { body, validationResult, query } = require('express-validator');


app.get('/', (req, res) => {
    res.send('Hello World, from your server');
});

app.get('/api/allSurveys',
    (req, res) => {
        survey_dao.allSurveys()
            .then((surveys) => { res.json(surveys) })
            .catch((error) => { res.status(500).json(error) });
    }
)

app.get('/api/yourSurveys',
    (req, res) => {
        survey_dao.surveysByAdmin(req.user.id)
            .then((surveys) => { res.json(surveys) })
            .catch((error) => { res.status(500).json(error) });
    }
)

app.get('/api/survey/:id',
    (req, res) => {
        const id = req.params.id;
        survey_dao.surveyById(id)
            .then((survey) => { res.json(survey) })
            .catch((error) => { res.status(500).json(error) });
    }
)

app.get('/api/survey/:id/getAnswers',
    (req, res) => {
        const id = req.params.id;
        survey_dao.answersBySurveyId(id)
            .then((answers) => { res.json(answers) })
            .catch((error) => { res.status(500).json(error) });
    }
)

app.post('/survey/api/sendAnswers',
    //TODO: Other validations on the other parts of the body
    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("starting to insert answers");
        const id = req.body.surveyId;
        const name = req.body.visitorName;
        const answers = req.body.answers;

        const checkAnswers = (survey) => {
            let questions = survey["questions"];
            let verified = true;
            questions.forEach(q => {
                let answer = answers.filter(a => (a.questionId === q.questionId));
                //open question
                console.log("checking question number " + q.questionId);
                if (q.options === undefined) {
                    /** Check if answers to open question is mandatory and user answered it */
                    if ((answer[0] === undefined || answer[0].text === undefined || answer[0].text.length === 0) && q.mandatory === 1) {
                        console.log("text not found");
                        verified = false;
                    }
                } else {
                    //multiple choice question
                    /** Check if answers to multiple question is mandatory and user answered it */
                    if ((answer[0] === undefined || answer[0].selectedOptions.length == 0) && q.min > 0) {
                        console.log("")
                        verified = false;
                    }

                    let ansNum;
                    //closed answer not given
                    if (answer[0] === undefined) {
                        ansNum = 0;
                    } else {
                        console.log("closed answer num options:  " +answer[0].selectedOptions.length);
                        ansNum = answer[0].selectedOptions.length;
                    }


                    if (ansNum > q.max || ansNum < q.min) {
                        console.log("max min of closed answer not respected")
                        verified = false;
                    }
                }

            });
            return verified;
        }

        survey_dao.surveyById(id)
            .then((survey) => {
                if (Object.entries(survey).length === 0)
                    res.status(404).json({ surveyId: this.id, error: "No survey with given id" });
                else {
                    /** Check if mandatory answers are given from user */
                    if (checkAnswers(survey)) {
                        /** Add answer to database */
                        console.log("ANSWERS OK!")
                        survey_dao.addAnswers(id, name, answers).then(() => {
                            /** Increment number of answers to that survey */
                            survey.answers_number++;
                            console.log(survey.answers_number)
                            survey_dao.incrementAnswersNum(id, survey.answers_number);
                            res.end();
                        })
                            .catch((error) => { res.status(500).json(error); });
                    } else {
                        res.status(400).json("Invalid answers given");
                    }
                }
            })
            .catch((error) => { res.status(500).json(error); });
    }
    
);


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
    res.status(404).json({ error: 'Not found!' });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}/`));