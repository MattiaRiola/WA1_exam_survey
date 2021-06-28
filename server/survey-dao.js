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
                questions: JSON.parse(s.questions),
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
            const survey = rows.map((s) => ({ 
                survey_id: s.survey_id,
                user_id: s.user_id,
                title: s.title, 
                questions: JSON.parse(s.questions),
                answers_number: s.answers_number
            }));
            resolve(survey);
        });
    });
};

// get all surveys
exports.surveyById = (surveyId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys WHERE survey_id = ?';
        db.get(sql, [surveyId], (err, row) => {
            if (err) {
                reject(err);
                return;
              }
              if (row == undefined) {
                reject({error: 'Survey not found.'});
              } else {
                const survey = { 
                    survey_id: row.survey_id,
                    user_id: row.user_id,
                    title: row.title, 
                    questions: JSON.parse(row.questions),
                    answers_number: row.answers_number
                };

                resolve(survey);
              }
        });
    });
};

exports.answersBySurveyId = (surveyId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM answers WHERE survey_id = ?';
        db.all(sql, [surveyId], (err, rows) => {
            if (err) {
                reject(err);
                return;
              }
              if (rows == undefined) {
                reject({error: 'answers not found.'});
              } else {
                const answers =rows.map((a) => ({ 
                    answer_id: a.answer_id,
                    survey_id: a.survey_id,
                    name: a.name, 
                    answers: JSON.parse(a.answers),
                    }));

                resolve(answers);
               }
        });
    });
}

exports.addAnswers = (surveyId, name, answers) => {
    console.log("adding " + name + "'s answers in the answers table");
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO answers(survey_id, name, answers) VALUES(?, ?, ? )';
        db.all(sql, [surveyId, name, JSON.stringify(answers)], (err, rows) => {
            if (err) {
                console.log("failed to insert answers in answers table\n err:\n " + err);
                reject(err);
                return;
            }
        
            resolve(surveyId);
        });
    });

};

exports.addSurvey = (survey, userId) => {
    console.log("adding survey " + survey.title);
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO surveys(title, questions, user_id, answers_number) VALUES(?, ?, ?, 0 )';
        db.all(sql, [survey.title, JSON.stringify(survey.questions), userId], (err, rows) => {
            if (err) {
                console.log("failed to insert answers in answers table\n err:\n " + err);
                reject(err);
                return;
            }
        
            resolve(userId);
        });
    });
}

exports.incrementAnswersNum = (surveyId, answerNumber) => {
    console.log("incrementing the answerNumber in surveys table")
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE surveys SET answers_number=? WHERE survey_id=?';
        db.all(sql, [answerNumber, surveyId], (err, rows) => {
            if (err) {
                console.log("failed to update answer_number in surveys table");
                reject(err);
                return;
            }
        
            resolve(surveyId);
        });
    });
}