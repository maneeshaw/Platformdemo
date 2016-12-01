var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var request = require("request");
var router = express.Router();
var superrequest = require('superagent');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});


// signin
router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Sign In' });
});



router.post("/action",function(req, res){
console.log("hello");

 var data = {
   "profile": {
     "firstName": req.body.firstName,
     "lastName": req.body.lastName,
     "email": req.body.email,
     "login": req.body.email
   },
   "credentials": {
     "password" : { "value": req.body.password },
     "recovery_question": {
       "question": req.body.securityQuestion,
       "answer": req.body.answer
     }
   }
 };

 superrequest
 .post('https://forest.okta.com/api/v1/users')
 .query({ activate: 'true' })
 .type('application/json')
 .accept('json')
 .set('Authorization', 'SSWS 00BkztJXBuZRC4N8-MGHCHo4KW_AYEsXNg2SPEXTWx')
 .send(data)
 .end(function(error, response){
   if (error || !response.ok) {
     console.log(error);
   } else {
    console.log(response)
    var userId = response.body.id;
    var query = "?userId=" + userId; 
    var redirectUrl = "/applications"
    res.redirect(redirectUrl + query);
   }
 });
});


// Registration

router.get('/registration', function(req, res, next) {



  res.render('registration', { title: 'Registration' });
});


// Applications
router.get('/applications', function(req, res, next) {
  var userId = req.query.userId;
  var options = { 
    method: 'GET',
    url: 'https://forest.okta.com/api/v1/users/'+ userId +'/appLinks',
    headers: 
        { 
          'cache-control': 'no-cache',
           authorization: 'SSWS 00BkztJXBuZRC4N8-MGHCHo4KW_AYEsXNg2SPEXTWx',
          'content-type': 'application/json',
           accept: 'application/json' 
        } 
 };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);

  var apps = JSON.parse(body)
    res.render('applications', { title: 'Applications', apps: apps });
  });
});


/* GET partners page. */
router.get('/partners', function(req, res, next) {
  res.render('partners', { title: 'Partners' });
});




module.exports = router;


