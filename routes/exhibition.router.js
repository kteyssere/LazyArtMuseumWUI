const express = require('express');
const axios = require('axios');
const exhibitionRouter = express.Router();
//const mywebserver = 'https://evening-escarpment-87282.herokuapp.com';
const mywebserver = 'https://localhost:8000';

exhibitionRouter.get('/', (req, res) => {
    axios.get(`${mywebserver}/exhibitions`)
    .then((results) => {
        res.render('exhibitions', {
            title: 'My Exhibitions',
            data: results.data 
        })
    }).catch((err) => res.send(err));
});
exhibitionRouter.post('/post', (req, res) => {
    axios.post(`${mywebserver}/exhibitions`, {
        name: req.fields.name,
        artist: req.fields.artist,
        picture: req.fields.picture,
        date: req.fields.date
    })
    .then((results) => {
        res.redirect('/exhibitions');
    }).catch((err) => res.send(err));
});
exhibitionRouter.post('/put', (req, res) => {
    axios.put(`${mywebserver}/exhibitions/${req.fields.id}`, {
        name: req.fields.name,
        artist: req.fields.artist,
        picture: req.fields.picture,
        date: req.fields.date
    })
    .then((results) => {
        res.redirect('/exhibitions');
    }).catch((err) => res.send(err));
});
exhibitionRouter.post('/delete', (req, res) => {
    axios.delete(`${mywebserver}/exhibitions/${req.fields.id}`)
    .then((results) => {
        res.redirect('/exhibitions');
    }).catch((err) => res.send(err));
});

module.exports = exhibitionRouter;