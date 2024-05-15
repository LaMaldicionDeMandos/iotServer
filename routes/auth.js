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
  async (accessToken, refreshToken, auth, profile, cb) => {
    const email = profile.emails[0].value;
    if (email) {
      authenticationService.googleLogin(email)
        .then((user) => cb(null, user))
        .catch(() => {
          authenticationService.googleRegister(email, profile)
            .then((accessToken) => cb(null, accessToken))
            .catch(cb);
        });
    } else {
      cb(new Error("Usuario no existe"));
    }
  }
));

router.get('/login/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google',
  passport.authenticate('google', { session: false, failureRedirect: '/login', failureMessage: true }),
  (req, res) => {
    console.log(`User: ${JSON.stringify(req.user)}`);
    res.send(req.user);
  });

router.post('/login', passport.authenticate('local', { session: false }),
  (req, res) => {
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

router.post('/validation/:username',
  [keepPropertiesAfter('_id,username,profile')],
  (req, res) => {
    usersService.verifyUser(req.params.username, req.body.validation_code)
      .then((user) => {
        res.status(201).send(user);
      }).catch((e) => {
        console.log("APA tiró un error " + e.toString());
        res.status(400).send({message: 'Invalid validation'});
    });
  });
module.exports = router;
