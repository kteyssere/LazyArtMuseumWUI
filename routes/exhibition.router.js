const express = require('express');
const axios = require('axios');
const exhibitionRouter = express.Router();
//const mywebserver = 'http://evening-escarpment-87282.herokuapp.com';
const mywebserver = 'http://localhost:8000';
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

const upload = multer({dest: "./public/uploads/"});

exhibitionRouter.use((req, res, next)=>{
    res.locals.moment = moment;
    next();
});

exhibitionRouter.get('/',(req, res) => {
    axios.get(`http://localhost:8000/exhibitions`)
    .then((results) => {
        let mysession = 0;
        if(req.session){
            if(req.session.email){
                // mysession = req.session.email;
                mysession = req.session;
            }
        }

        res.render('exhibitions', {
            title: 'My Exhibitions',
            data: results.data,
            sessionusr: mysession
        })
    }).catch((err) => res.send(err));

});

exhibitionRouter.get('/:id',(req, res) => {
    axios.get(`http://localhost:8000/exhibitions/${req.params.id}`)
        .then((results) => {
            let mysession = 0;
            if(req.session){
                if(req.session.email){
                    // mysession = req.session.email;
                    mysession = req.session;
                    res.render('exhibitionsshow', {
                        title: 'My Exhibition',
                        data: results.data,
                        sessionusr: mysession
                    });
                }else{
                    res.send('You must be logged in to do this');
                }
            }

        }).catch((err) => res.send(err));
});
//UPDATE
exhibitionRouter.post('/edit/:id', (req, res) => {
    if(req.session){
        if(req.session.roles === "admin") {
            axios.post(`${mywebserver}/exhibitions/${req.params.id}`, {
                name: req.fields.name,
                artist: req.fields.artist,
                // picture: req.fields.picture,
                picture: req.files.originalname,
                date: req.fields.date,
                description: req.fields.description
            })
                .then((results) => {
                    res.redirect('/exhibitions');
                }).catch((err) => res.send(err));
        }else{
            res.send('You are not allowed to do this');
        }
    }


});
exhibitionRouter.post('/new',upload.single("file"), (req, res) => {
    if(req.session){
        if(req.session.roles === "admin"){
            axios.put(`http://localhost:8000/exhibitions`, {
                name: req.fields.name,
                artist: req.fields.artist,
                picture: req.fields.picture,
                date: req.fields.date,
                description: req.fields.description
            })
                .then((results) => {
                    console.log(req.files);
                    console.log(req.files.file.name);
                    const tempPath = req.files.file.path;
                    const targetPath = path.join(__dirname, `./public/uploads/${req.files.file.name}`);

                    if (path.extname(req.files.file.name).toLowerCase() === ".png" || ".jpg" || ".jpeg") {
                        fs.rename(tempPath, targetPath, err => {
                            if (err) return handleError(err, res);

                            //res
                            //.status(200)
                            // .contentType("text/plain")
                            // .end("File uploaded!")
                            console.log("here");
                            res.redirect('/');
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

                }).catch((err) => res.send(err));
        }else {
            res.send('You are not allowed to do this');
        }
    }

});

exhibitionRouter.post('/delete/:id', (req, res) => {
    if(req.session){
        if(req.session.roles === "admin"){
            axios.delete(`http://localhost:8000/exhibitions/${req.params.id}`)
            .then((results) => {
                res.redirect('/exhibitions');
            }).catch((err) => res.send(err));
        }else {
            res.send('You are not allowed to do this');
        }
    }

});

exhibitionRouter.post('/buyticket/:id', (req, res) => {
    axios.post(`http://localhost:8000/exhibitions/buyticket/${req.params.id}`, {
        // name: req.fields.name,
        // artist: req.fields.artist,
        // // picture: req.fields.picture,
        // picture: req.files.originalname,
        // date: req.fields.date
        test:req.fields.name
    })
        .then((results) => {
            console.log(req);
            res.redirect('/exhibitions');
        }).catch((err) => res.send(err));
});

module.exports = exhibitionRouter;