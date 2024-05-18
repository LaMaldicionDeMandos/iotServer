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

router.patch('/:id', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    placesService.changeHouseName(req.auth.id, req.params.id, req.body.name)
      .then((house) => {
        if (house) res.send(house);
        else res.status(404).send({message: `House ${req.params.id} not found`});
      })
      .catch(e => res.status(500).send(e.message));
  });

router.delete('/:id', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    placesService.deleteHouse(req.auth.id, req.params.id)
      .then((ok) => {
        if (ok) res.status(204).send();
        else res.status(400).send({message: `House ${req.params.id} is primary house ${ok}`});
      })
      .catch(e => res.status(500).send(e.message));
  });

router.get('', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    placesService.findMyHouses(req.auth.id)
      .then(res.send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.post('/:id/rooms', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    placesService.newRoom(req.auth.id, req.params.id, req.body.name)
      .then(res.status(201).send.bind(res))
      .catch(e => res.status(400).send(e.message));
  });

router.get('/:id/rooms', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    placesService.getRooms(req.auth.id, req.params.id)
      .then(res.send.bind(res))
      .catch(e => res.status(500).send(e.message));
  });

router.patch('/:id/rooms/:roomId', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    placesService.changeRoomName(req.auth.id, req.params.roomId, req.body.name)
      .then((room) => {
        if (room) res.send(room);
        else res.status(404).send({message: `Room ${req.params.roomId} not found`});
      })
      .catch(e => res.status(500).send(e.message));
  });

router.delete('/:id/rooms/:roomId', jwt({ secret: SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    placesService.deleteRoom(req.auth.id, req.params.roomId)
      .then((ok) => {
        if (ok) res.status(204).send();
        else res.status(400).send({message: `Room ${req.params.roomId} cant be deleted`});
      })
      .catch(e => res.status(500).send(e.message));
  });

module.exports = router;
