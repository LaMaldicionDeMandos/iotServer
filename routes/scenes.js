const { expressjwt: jwt } = require('express-jwt');
const express = require('express');
const router = express.Router({mergeParams: true});

const scenesService = require('../services/scenes.service');
const changeStatusListener = require('../services/change-status-listener');

const _ = require('lodash');

const SECRET = process.env.SECRET;

router.post('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    scenesService.newScene(req.auth.id, req.params.houseId, req.body)
      .then(res.status(201).send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.get('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
  console.log(`Params: ${JSON.stringify(req.params)}`);
    scenesService.findMyScenes(req.auth.id, req.params.houseId)
      .then(res.send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.put('/:id', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    scenesService.updateScene(req.auth.id, req.body)
      .then(res.status(200).send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.delete('/:id', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    scenesService.deleteScene(req.auth.id, req.params.id)
      .then((ok) => {
        if (ok) res.status(204).send();
        else res.status(400).send({message: `Scene ${req.params.id} cant be deleted`});
      })
      .catch(e => res.status(500).send(e.message));
  });

router.post('/:id/touch', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    scenesService.activateScene(req.auth.id, req.params.id, 'touch')
      .then(res.status(201).send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.post('/mock-change-state',
  async (req, res) => {
    changeStatusListener.changeDeviceStatus(req.body.deviceId, req.body.status)
      .then(res.status(201).send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

module.exports = router;
