const { expressjwt: jwt } = require('express-jwt');
const express = require('express');
const router = express.Router({mergeParams: true});

const devicesService = require('../services/devices.service');

const _ = require('lodash');

const SECRET = process.env.SECRET;

router.post('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    devicesService.newDevice(req.auth.id, req.params.houseId, req.body)
      .then(res.status(201).send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.patch('/:id', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    devicesService.updateDevice(req.auth.id, req.params.id, _.pick(req.body, ['name', 'roomId']))
      .then(res.status(200).send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.get('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
  console.log(`Params: ${JSON.stringify(req.params)}`);
    devicesService.findMyDevices(req.auth.id, req.params.houseId)
      .then(res.send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.delete('/:id', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    devicesService.deleteDevice(req.auth.id, req.params.id)
      .then((ok) => {
        if (ok) res.status(204).send();
        else res.status(400).send({message: `Device ${req.params.id} cant be deleted`});
      })
      .catch(e => res.status(500).send(e.message));
  });

module.exports = router;
