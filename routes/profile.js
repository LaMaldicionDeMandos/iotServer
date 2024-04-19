const { expressjwt: jwt } = require('express-jwt');
const express = require('express');
const router = express.Router();

const usersService = require('../services/users.service');
const keepPropertiesAfter = require('./keepPropertiesAfter');
require("json-circular-stringify");

const SECRET = process.env.SECRET;

router.get('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
  console.log(JSON.stringify(req.auth));
    usersService.getByUsername(req.auth.username)
      .then((user) => res.send(user.profile));
  });

module.exports = router;
