'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('survey.db', (err) => {
    if (err) throw err;
});

// get all surveys
exports.allSurveys = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys';
        db.all(sql,  (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            const surveys = rows.map((s) => ({ 
                survey_id: s.survey_id,
                user_id: s.user_id,
                title: s.title, 
                questions: s.questions,
                answers_number: s.answers_number
            }));
            resolve(surveys);
        });
    });
};

// get all surveys
exports.surveysByAdmin = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys WHERE user_id = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            const surveys = rows.map((s) => ({ 
                survey_id: s.survey_id,
                user_id: s.user_id,
                title: s.title, 
                questions: s.questions,
                answers_number: s.answers_number
            }));
            resolve(surveys);
        });
    });
};