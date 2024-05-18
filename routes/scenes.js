const { expressjwt: jwt } = require('express-jwt');
const express = require('express');
const router = express.Router({mergeParams: true});

const scenesService = require('../services/scenes.service');

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

module.exports = router;
