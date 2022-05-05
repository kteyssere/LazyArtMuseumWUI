const express = require('express');
const axios = require('axios');
const exhibitionRouter = express.Router();
//const mywebserver = 'http://evening-escarpment-87282.herokuapp.com';
const mywebserver = 'http://localhost:8000';
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

const upload = multer({dest: "./public/uploads/"});

exhibitionRouter.get('/',(req, res) => {
    axios.get(`http://localhost:8000/exhibitions`)
    .then((results) => {
        res.render('exhibitions', {
            title: 'My Exhibitions',
            data: results.data
        })
    }).catch((err) => res.send(err));
});

exhibitionRouter.get('/:id',(req, res) => {
    console.log(req.params);
    axios.get(`http://localhost:8000/exhibitions/:id`,{
        id: req.params.id
    })
        .then((results) => {
            console.log('here');
            res.render('exhibitionsshow', {
                title: 'My Exhibition',
                data: results.data
            })
        }).catch((err) => res.send(err));
});
//UPDATE
exhibitionRouter.post('/edit', (req, res) => {
    axios.post(`${mywebserver}/exhibitions`, {
        name: req.fields.name,
        artist: req.fields.artist,
        // picture: req.fields.picture,
        picture: req.files.originalname,
        date: req.fields.date
    })
    .then((results) => {
        res.redirect('/exhibitions');
    }).catch((err) => res.send(err));


});
exhibitionRouter.post('/new',upload.single("file"), (req, res) => {
    axios.put(`${mywebserver}/exhibitions`, {
        name: req.fields.name,
        artist: req.fields.artist,
        picture: req.fields.picture,
        date: req.fields.date
    })
    .then((results) => {
        console.log(req.files.file.name);
        const tempPath = req.files.file.path;
        const targetPath = path.join(__dirname, `./public/uploads/${req.files.file.name}`);

        if (path.extname(req.files.file.name).toLowerCase() === ".png") {
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);

                //res
                    //.status(200)
                    // .contentType("text/plain")
                    // .end("File uploaded!")

            });
        }
        else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(403)
                    .contentType("text/plain")
                    .end("Only .png files are allowed!");
            });
         }
        console.log('abc');
    res.redirect('/exhibitions');
    }).catch((err) => res.send(err));
});
// exhibitionRouter.post('/delete', (req, res) => {
//     axios.delete(`${mywebserver}/exhibitions/${req.fields.id}`)
//     .then((results) => {
//         res.redirect('/exhibitions');
//     }).catch((err) => res.send(err));
// });

module.exports = exhibitionRouter;