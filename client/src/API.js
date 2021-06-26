




/*************************************************************************************/
/* USER AND AUTHENTICATION API */

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user.name;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch('api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

async function getSurveysByAdmin() {
    try {
        const response = await fetch('/api/yourSurveys/');
        if (response.ok) {
            const surveys = await response.json();
            return surveys.map(s => {s.questions = JSON.parse(s.questions); return s;});
        }
        else {
            throw new Error(response.statusText);
        }
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

async function getAllSurveys() {
    try {
        const response = await fetch('/api/allSurveys/');
        if (response.ok) {
            const surveys = await response.json();
            return surveys.map(s => {s.questions = JSON.parse(s.questions); return s;});
        }
        else {
            throw new Error(response.statusText);
        }
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

async function getSurveyById(id){
    try {
        const response = await fetch('/api/survey/'+id);
        if (response.ok) {
            const survey = await response.json();
            
            survey.questions = JSON.parse(survey.questions);
            return survey;
        }
        else {
            throw new Error(response.statusText);
        }
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

const API = { logIn, logOut, getUserInfo , getSurveysByAdmin, getAllSurveys, getSurveyById};


export default API;
