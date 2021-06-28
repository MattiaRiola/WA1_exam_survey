# Exam #1: "Survey"
## Student: s280169 RIOLA MATTIA 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `users` - contains user_id email username password

| user_id | email                  | username  | password      |
| ------- | ---------------------- | --------- | ------------- |
| 1       | admin@mail.com         | admin     | password      |
| 2       | riola.mattia@gmail.com | Mattia    | mattia        |
| 3       | teacher@polito.com     | Teacher   | teacher30     |

-----

- Table `surveys` - contains survey_id user_id title questions answers_number

| survey_id | user_id | title                | questions               | answers_number |
| --------- | ------- | -------------------- | ----------------------- | -------------- |
| 1         | 1       | website satisfaction | json object (see below) | 2              |
| 2         | 3       | math quiz            | json object (see below) | 0              |
| 3         | 3       | physics quiz         | json object (see below) | 1              |



  - 'Website satisfaction' `questions` :  
```plantuml
@startjson
[{"title":"Rate this website","mandatory":1,"questionId":1,"max":1,"min":1,"options":[{"optionId":1,"questionId":1,"text":"very good"},{"optionId":2,"questionId":1,"text":"good"},{"optionId":3,"questionId":1, "text":"average"},{"optionId":4,"questionId":1, "text":"bad"},{"optionId":5,"questionId":1, "text":"very bad"}]},{"title":"tell me what you think about this website:","mandatory":0,"questionId":2},{"title":"Where did you find this website?","mandatory":0,"max":3,"min":0,"questionId":3, "options":[{"optionId":1,"questionId":3, "text":"social"},{"optionId":2,"questionId":3, "text":"friends"},{"optionId":3,"questionId":3, "text":"others"}]}]
@endjson
```
 - 'math quiz' `questions` :
```plantuml
@startjson
[{"title":"2+2 = ","mandatory":0,"questionId":1, "max":1,"min":0,"options":[{"optionId":1,"questionId":1, "text":"44"},{"optionId":2,"questionId":1, "text":"4"}]},{"title":"is math important?","mandatory":0,"max":1,"min":0,"questionId":2, "options":[{"optionId":1,"questionId":2, "text":"yes"},{"optionId":2,"questionId":2, "text":"no"},{"optionId":3,"questionId":2, "text":"maybe"}]}]
@endjson
```
 - 'physics quiz' `questions` :
```plantuml
@startjson
[{"title":"F = m * a ","mandatory":0,"questionId":1, "max":1,"min":0,"options":[{"optionId":1,"questionId":1, "text":"True"},{"optionId":2,"questionId":1, "text":"False"}]},{"title":"is physics important?","mandatory":0,"max":1,"min":0,"questionId":2, "options":[{"optionId":1,"questionId":2, "text":"yes"},{"optionId":2,"questionId":2, "text":"no"},{"optionId":3,"questionId":2, "text":"maybe"}]}]
@endjson
```
```plantuml
@startjson
[{"questionId":0,"title":"question1","mandatory":0},{"questionId":1,"title":"question2","mandatory":0},{"questionId":3,"title":"closedQuestion3","min":0,"max":1,"options":[{"optionId":0,"questionId":3,"text":"option1"},{"optionId":1,"questionId":3,"text":"option2"}]}]
@endjson
```
----

- Table `answers` - contains answer_id survey_id name answers

| answer_id | survey_id | name                   | answers                 |
| --------- | --------- | ---------------------- | ----------------------- |
| 1         | 1         | Mario                  | json object (see below) |
| 2         | 1         | Luigi                  | json object (see below) |
| 3         | 3         | Mattia Riola (s280169) | json object (see below) |

  - 'Mario' `answers` :
```plantuml
@startjson
[{"questionId":1,"selectedOptions":[1]},{"questionId":2,"text":"I like the colour choice of the website"},{"questionId":3,"selectedOptions":[1,2]}]
@endjson
```
 - 'Luigi' `answers` :
```plantuml
@startjson
[{"questionId":1,"selectedOptions":[4]},{"questionId":2,"text":""},{"questionId":3,"selectedOptions":[3]}]
@endjson
```
 - 'Mattia Riola (s280169) `answers` :
```plantuml
@startjson
[{"questionId":1,"selectedOptions":[1]},{"questionId":2,"selectedOptions":[1]}]
@endjson
```


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials
- username, password (plus any other requested info)
- admin@mail.com, password
- riola.mattia@gmail.com, mattia
- teacher@polito.com, teacher30
