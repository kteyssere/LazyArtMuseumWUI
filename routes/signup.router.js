const express = require('express');
const axios = require('axios');
const signupRouter = express.Router();
const mywebserver = 'http://localhost:8000';

signupRouter.post('/signuppost', (req, res) => {
    console.log(req.fields.name);
    axios.post(`${mywebserver}/signup`, {
        name: req.fields.name,
        email: req.fields.email,
        password: req.fields.password
    })
        .then((results) => {

            res.redirect('/login');
        }).catch((err) => res.send(err));

});

module.exports = signupRouter;