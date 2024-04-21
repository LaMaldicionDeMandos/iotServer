const { expressjwt: jwt } = require('express-jwt');
const express = require('express');
const router = express.Router();

const devicesService = require('../services/devices.service');

const SECRET = process.env.SECRET;

router.post('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    devicesService.newDevice(req.auth.id, req.body)
      .then(res.status(201).send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.get('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    devicesService.findMyDevices(req.auth.id)
      .then(res.send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

module.exports = router;
