const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authenticationService = require('../services/authentication.service');
const usersService = require('../services/users.service');
const keepPropertiesAfter = require('./keepPropertiesAfter');

const DEEP_LINK = process.env.DEEP_LINK;

passport.use(new LocalStrategy({usernameField: 'username'}, (user, password, done) =>
  authenticationService.login(user, password)
    .then((accessToken) => done(null, accessToken))
    .catch(err => done(null, err))
));

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
