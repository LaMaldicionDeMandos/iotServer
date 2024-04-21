const { expressjwt: jwt } = require('express-jwt');
const express = require('express');
const router = express.Router();

const placesService = require('../services/places.service');

const SECRET = process.env.SECRET;

router.post('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    placesService.newHome(req.auth.id, req.body.name)
      .then(res.status(201).send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.get('/primary', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    placesService.findMyPrimaryHouse(req.auth.id)
      .then(res.send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.get('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    placesService.findMyHouses(req.auth.id)
      .then(res.send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

module.exports = router;
