let express = require('express')
let app = express()
let bodyParser = require('body-parser')
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
let request = require('request')
let router = express.Router()
let superrequest = require('superagent')
let fetch = require('node-fetch')
let authToken = 'SSWS 00BkztJXBuZRC4N8-MGHCHo4KW_AYEsXNg2SPEXTWx'

let groupIdA = '00g2lfei407TmPOy41t7'
let groupIdB = '00g2lfeuappfbFCg51t7'
let groupIdC = '00g2lfdzlcD4Hj1qY1t7'
let groupOKA = true
let groupOKB = true
let groupOKC = true

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' })
})

/* profile page */
router.get('/profile', function(req, res, next) {
  superrequest
  .get('https://forest.okta.com/api/v1/users/me')
  .type('application/json')
  .accept('json')
  .set('Authorization', authToken)
  // .send(data)
  .end(function(error, response) {
    if(error || !response.ok) {
      console.log(error)
    } else {
      console.log(response.body)
      let maneesha = {
        title: 'Profile',
        firstName: 'Maneesha',
        lastName: 'Wijesinghe',
        email: 'maneesha@email.com',
        petsName: 'Roofus'
      }

      let profile = response.body.profile || maneesha
      profile.userId = response.body.id
      res.render('profile', profile)
    }
  })

})

// signin
router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Sign In' })
})

router.post('/action',function(req, res) {

 let data = {
   'profile': {
     'firstName': req.body.firstName,
     'lastName': req.body.lastName,
     'email': req.body.email,
     'login': req.body.email,
     'petsName':req.body.petsName
   },
   'credentials': {
     'password' : { 'value': req.body.password },
     'recovery_question': {
       'question': req.body.securityQuestion,
       'answer': req.body.answer
     }
   }
 }

 superrequest
 .post('https://forest.okta.com/api/v1/users')
 .query({ activate: 'true' })
 .type('application/json')
 .accept('json')
 .set('Authorization', authToken)
 .send(data)
 .end(function(error, response){
   if (error || !response.ok) {
     console.log(error)
   } else {
    console.log(response)
    let userId = response.body.id
    let query = '?userId=' + userId
    let redirectUrl = '/applications'
    res.redirect(redirectUrl + query)
   }
 })
})

// Registration
router.get('/registration', function(req, res, next) {
  res.render('registration', { title: 'Registration' })
})

// Applications
router.get('/applications', function(req, res, next) {
  let userId = req.query.userId
  let options = {
    method: 'GET',
    url: 'https://forest.okta.com/api/v1/users/' + userId + '/appLinks',
    headers: {
      'cache-control': 'no-cache',
      authorization: authToken,
      'content-type': 'application/json',
      accept: 'application/json'
    }
  }

request(options, function(error, response, body) {
  if(error) throw new Error(error)

  console.log(body)

  let apps = JSON.parse(body)
    res.render('applications', { title: 'Applications', apps: apps, userId: userId })
  })
})

/* GET partners page. */
router.get('/partners', function(req, res, next) {
  res.render('partners', { title: 'Partners' })
})

// admin

router.get('/admin', function(req, res, next) {
  res.render('admin', { title: 'Admin' })
})

// New Group User
router.post('/new-group-user', function(req, res) {

  if(!groupOKA && req.body.groupId === groupIdA
  || !groupOKB && req.body.groupId === groupIdB
  || !groupOKC && req.body.groupId === groupIdC) {
    return res.send('Sorry, you can only have up 4 members in your group.')
  }

  let groupData = {
    'profile': {
      'firstName': req.body.firstName,
      'lastName': req.body.lastName,
      'email': req.body.email,
      'login': req.body.email
    },
    groupIds: [
      req.body.groupId
    ]
  }

  superrequest
  .post('https://forest.okta.com/api/v1/users')
  .query({ activate: 'false' })
  .type('application/json')
  .accept('json')
  .set('Authorization', authToken)
  .send(groupData)
  .end(function(error, response) {
    if(error || !response.ok) {
      res.send(error.status + ': ' + error.response.text)
    } else {
      res.send('User created successfully')
      console.log(response)
    }
  })
})

function getGroupCount(groupId) {
  console.log('fetching', groupId)
  return fetch('https://forest.okta.com/api/v1/groups/' + groupId + '/users', {
    method: 'GET',
    headers: {
      'Authorization': authToken,
      'Accept': 'application/json'
    }
  })
  .then(res => res.json())
  .catch(e => console.log(e))
}

router.get('/groups', function(req, res, next) {
  getGroupCount(groupIdA)
    .then(data1 => {
      getGroupCount(groupIdB)
        .then(data2 => {
          getGroupCount(groupIdC)
            .then(data3 => {
              groupOKA = data1.length < 4
              groupOKB = data2.length < 4
              groupOKC = data3.length < 4

              return res.render('groups', {
                title: 'Groups',
                groupACount: data1.length,
                groupAClass: !groupOKA ? 'red' : '',
                groupBCount: data2.length,
                groupBClass: !groupOKB ? 'red' : '',
                groupCCount: data3.length,
                groupCClass: !groupOKC ? 'red' : ''
              })
            })
        })
    })
  .catch(e => console.log(e))
})

module.exports = router
