const { expressjwt: jwt } = require('express-jwt');
const express = require('express');
const router = express.Router();

const usersService = require('../services/users.service');
const keepPropertiesAfter = require('./keepPropertiesAfter');
require("json-circular-stringify");

const SECRET = process.env.SECRET;

router.get('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  [keepPropertiesAfter('_id,username,profile')],
  async (req, res) => {
  console.log(JSON.stringify(req.auth));
    usersService.getByUsername(req.auth.username)
      .then(res.send.bind(res));
  });

module.exports = router;
