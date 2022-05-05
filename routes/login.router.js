const express = require('express');
const axios = require('axios');
const loginRouter = express.Router();
const mywebserver = 'https://localhost:8000';

loginRouter.post('/post', (req, res) => {
    axios.put(`${mywebserver}/login`, {
        email: req.fields.email,
        password: req.fields.password
    })
        .then((results) => {
            res.redirect('/exhibitions');
        }).catch((err) => res.send(err));

});

module.exports = loginRouter;