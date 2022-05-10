const express = require('express');
const formidable = require('express-formidable');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const mywebserver = 'https://lazy-art-museum-api.herokuapp.com';
//const mywebserver = 'http://localhost:8000';
const exhibitionRouter = require('./routes/exhibition.router');
const userRouter = require('./routes/user.router');
const signupRouter = require('./routes/signup.router');
const session = require('express-session');
const axios = require("axios");
const bcrypt = require('bcryptjs');
const qr = require("qrcode");

app.use(formidable());
app.use(session({ resave: true, secret: 'mysecret', saveUninitialized: true}));

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
    let mysession = 0;
    if(req.session){
        if(req.session.email){
            // mysession = req.session.email;
            mysession = req.session;
        }
    }
    res.render('index', {title: 'Welcome to website for exhibition', sessionusr: mysession});
});

app.get('/login', (req, res) => {
    let mysession = 0;
    if(req.session){
        if(req.session.email){
            // mysession = req.session.email;
            mysession = req.session;
        }
    }
    res.render('login', {title: 'Login Page', sessionusr: mysession} );
});

app.post('/plogin', (req, res) => {

    axios.post(`${mywebserver}/plogin`, {
        email: req.fields.email,
        password: req.fields.password
    })
        .then(async (results) => {
            if (req.fields.email === results.data.email && (await bcrypt.compare(req.fields.password, results.data.password))) {
                req.session.email = req.fields.email;
                req.session.roles = results.data.roles;
                req.session.name = results.data.name;
                req.session.userId = results.data.userId;
                res.redirect('/');
            } else {
                res.send('Invalid credentials');
            }
        }).catch((err) => res.send(err));

});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.use('/exhibitions', exhibitionRouter)
app.use('/users', userRouter)
app.use('/signup', signupRouter)

app.get('/about', (req, res) => {

    let mysession = 0;
    if(req.session){
        if(req.session.email){
            mysession = req.session;
        }
    }
    const url = "https://www.google.com/maps/place/Musée+de+Grenoble/@45.194928,5.7301242,17z/data=!3m1!4b1!4m5!3m4!1s0x478af4f4b38dff7d:0xdd66c42bbf04a627!8m2!3d45.194928!4d5.7323129?hl=fr";

    qr.toDataURL(url, (err, src) => {
        if (err) res.send("Error occured");

        // Let us return the QR code image as our response and set it to be the source used in the webpage
        //res.render("scan", { src });
        res.render('about', {title: 'Welcome to website for exhibition', sessionusr: mysession, qrcarte: src});
    });


});

/* GET Signup */
app.get('/signup', function(req, res) {
    let mysession = 0;
    if(req.session){
        if(req.session.email){
            mysession = req.session;
        }
    }
    res.render('signup', { title: 'Signup Page',sessionusr: mysession});
});

/* GET create exhibition */
app.get('/create-exhibition', function(req, res) {
    let mysession = 0;
    if(req.session){
        if(req.session.roles === "admin"){
            mysession = req.session;
            res.render('createexhibition', { title: 'Create a new exhibition',sessionusr: mysession});
        }else{
            res.send('You are not allowed to do this');
        }
    }
});

/* GET update exhibition */
app.get('/edit-exhibition/:id', function(req, res) {
    let mysession = 0;
    if(req.session){
        if(req.session.roles === "admin"){
            axios.get(`${mywebserver}/exhibitions/${req.params.id}`)
                .then((results) => {
                    mysession = req.session;
                    res.render('editexhibition', {
                        title: 'edit a exhibition',
                        data: results.data,
                        sessionusr: mysession
                    })
                }).catch((err) => res.send(err));
        }else{
            res.send('You are not allowed to do this');
        }
    }
});

/* GET update user */
app.get('/edit-user/:id', function(req, res) {
    let mysession = 0;
    if(req.session){
        if(req.session.email){
            axios.get(`${mywebserver}/users/${req.params.id}`)
                .then((results) => {
                    mysession = req.session;
                    if(req.session.email === results.data.email){
                        res.render('edituser', {
                            title: 'edit a user',
                            data: results.data,
                            sessionusr: mysession
                        });
                    }else{
                        res.send('You are not allowed to edit another user than you');
                    }

                }).catch((err) => res.send(err));
        }else{
            res.send('You must be logged in to do this');
        }
    }
});

app.post('/buytickets/:id', (req, res) => {

    if(req.session){
        if(req.session.email){
            axios.post(`${mywebserver}/buytickets`, {
                //usrMail: req.session.email,
                exhibitionId: req.params.id,
                respform: req.fields
            }).then(r => {
                res.redirect('/');
            }).catch((err) => res.send(err));
        }else{
            res.send('You must be logged in to do this');
        }
    }

    // axios.get(`${mywebserver}/exhibitions/${req.params.id}`)
    //     .then((results) => {
    //
    //         //res.redirect('/exhibitions');
    //     }).catch((err) => res.send(err));

});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});