const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const authenticationService = require('../services/authentication.service');
const usersService = require('../services/users.service');
const keepPropertiesAfter = require('./keepPropertiesAfter');
require("json-circular-stringify");

const DEEP_LINK = process.env.DEEP_LINK;

passport.use(new LocalStrategy({usernameField: 'username'}, (user, password, done) =>
  authenticationService.login(user, password).then((accessToken) => done(null, accessToken)).catch(err => done(null, err))
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL,
    scope: [ 'profile', 'email' ],
    state: false
  },
  function verify(accessToken, refreshToken, auth, profile, cb) {
    console.log(`Profile: ${JSON.stringify(profile)} Access Token ${accessToken}, Auth: ${JSON.stringify(auth)}`)
    cb(null, {username: 'Podria devolver token de google y depaso hago uno parecido así uso el mismo'});
  }
));

router.get('/login/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google',
  passport.authenticate('google', { session: false, failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    console.log(`Req: ${JSON.stringify(req)}`);
    res.send(req.user);
  });
router.post('/login', passport.authenticate('local', { session: false }),
  (req, res) => {
    console.log(`User: ${req.user}`);
    if(!req.user.error) res.send(req.user);
    else res.status(401).send(req.user);
  });

router.post('/register',
  [keepPropertiesAfter('_id,username,profile')],
  (req, res) => {
  usersService.register(req.body)
      .then((user) => res.status(201).send(user))
      .catch(e => res.status(500).send(e.message));
  });

router.get('/validation/:user_id', (req, res) => {
    usersService.getById(req.params.user_id)
      .then(async (user) => {
        if (user && user.state == 'INACTIVE') {
          await usersService.activeUser(user.username);
        }
        console.log("Pasó?");
        res.redirect(DEEP_LINK);
      }).catch((e) => {
        console.log("APA tiró un error " + e.toString());
        res.redirect(DEEP_LINK);
    });
  });
module.exports = router;
