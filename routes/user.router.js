const express = require('express');
const axios = require('axios');
const userRouter = express.Router();
const mywebserver = 'https://lazy-art-museum-api.herokuapp.com';
//const mywebserver = 'http://localhost:8000';
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

userRouter.get('/',(req, res) => {
    axios.get(`${mywebserver}/users`)
    .then((results) => {
        let mysession = 0;
        if(req.session){
            if(req.session.email){
                // mysession = req.session.email;
                mysession = req.session;
            }
        }
        res.render('users', {
            title: 'My Users',
            data: results.data,
            sessionusr: mysession
        })
    }).catch((err) => res.send(err));

});

userRouter.get('/:id',(req, res) => {
    axios.get(`${mywebserver}/users/${req.params.id}`)
        .then((results) => {
            let mysession = 0;
            if(req.session){
                if(req.session.email){
                    // mysession = req.session.email;
                    mysession = req.session;
                }
            }
            res.render('usersshow', {
                title: 'My User',
                data: results.data,
                sessionusr: mysession
            })
        }).catch((err) => res.send(err));
});

//UPDATE
userRouter.post('/edit/:id', (req, res) => {
    if(req.session){
        if(req.session.email) {
            axios.post(`${mywebserver}/users/${req.params.id}`, {
                name: req.fields.name,
                email: req.fields.email,
                password: req.fields.password,
                role: req.fields.role
            })
                .then((results) => {
                    res.redirect('/users');
                }).catch((err) => res.send(err));
        }else{
            res.send('You are not allowed to do this');
        }
    }
});

userRouter.post('/new',upload.single("file"), (req, res) => {
    if(req.session){
        if(req.session.roles === "admin"){
            axios.put(`${mywebserver}/users`, {
                name: req.fields.name,
                artist: req.fields.artist,
                picture: req.fields.picture,
                date: req.fields.date
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

userRouter.post('/delete/:id', (req, res) => {
    if(req.session){
        if(req.session.roles === "admin"){
            axios.delete(`${mywebserver}/users/${req.params.id}`)
            .then((results) => {
                res.redirect('/users');
            }).catch((err) => res.send(err));
        }else {
            res.send('You are not allowed to do this');
        }
    }

});

userRouter.post('/buyticket/:id', (req, res) => {
    axios.post(`${mywebserver}/users/buyticket/${req.params.id}`, {
        // name: req.fields.name,
        // artist: req.fields.artist,
        // // picture: req.fields.picture,
        // picture: req.files.originalname,
        // date: req.fields.date
        test:req.fields.name
    })
        .then((results) => {
            console.log(req);
            res.redirect('/users');
        }).catch((err) => res.send(err));
});

module.exports = userRouter;