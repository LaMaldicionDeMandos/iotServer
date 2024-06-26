const { expressjwt: jwt } = require('express-jwt');
const express = require('express');
const router = express.Router();

const usersService = require('../services/users.service');
const SECRET = process.env.SECRET;

router.get('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    usersService.getByUsername(req.auth.username)
      .then((user) => res.send(user.profile))
      .catch(e => res.status(500).send(e.message));
  });

module.exports = router;
