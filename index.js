const express = require('express');
const formidable = require('express-formidable');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const exhibitionRouter = require('./routes/exhibition.router');
const signupRouter = require('./routes/signup.router');
const loginRouter = require('./routes/login.router');
const flash = require('connect-flash');
const session = require('express-session');
const axios = require("axios");
const passport = require("passport");
const nodemailer = require('nodemailer');

app.use(formidable());

app.use(session({
    secret:'geeksforgeeks',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
    //console.log(req);
    res.render('index', {title: 'Welcome to website for exhibition'});
});

app.use('/exhibitions', exhibitionRouter)
app.use('/signup', signupRouter)
app.use('/login', loginRouter)
app.get('/about', (req, res) => {
    res.render('about', {title: 'Welcome to website for exhibition'});
});
/* GET login page. */
app.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login Page', message:
            req.flash('loginMessage') });
});
//logout
app.get('/logout',(req,res)=>{
    req.session.destroy(function (err) {
        res.redirect('/login'); //Inside a callback… bulletproof!
    });
    //req.logout();
    req.flash('success_msg','Now logged out');

})
/* GET Signup */
app.get('/signup', function(req, res) {
    res.render('signup', { title: 'Signup Page',
        message:req.flash('signupMessage') });
});

/* GET Profile page. */
app.get('/profile',  function(req, res, next) {
    res.render('profile', { title: 'Profile Page', user : req.user,
        avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d:
                'retro'}, true) });
});

/* GET create exhibition */
app.get('/create-exhibition', function(req, res) {
    res.render('createexhibition', { title: 'Create a new exhibition',
        message:req.flash('createExhibitionMessage') });
});

/* GET update exhibition */
app.get('/edit-exhibition/:id', function(req, res) {
    axios.get(`http://localhost:8000/exhibitions/${req.params.id}`)
        .then((results) => {
            res.render('editexhibition', {
                title: 'edit a exhibition',
                data: results.data,
                message:req.flash('editExhibitionMessage')
            })
        }).catch((err) => res.send(err));
    // res.render('editexhibition', {
    //     title: 'edit a exhibition',
    //     message:req.flash('editExhibitionMessage'),
    //
    // });
});

app.post('/buytickets/:id', (req, res) => {
    axios.get(`http://localhost:8000/exhibitions/${req.params.id}`)
        .then((results) => {
            // res.render('exhibitions', {
            //     title: 'My Exhibitions',
            //     data: results.data
            // })
            axios.post(`http://localhost:8000/buytickets`, {
                usr: req.fields,
                exhibition: results.data
            }).then(r => {res.redirect('/exhibitions');}).catch((err) => res.send(err));
            res.redirect('/exhibitions');
                // .then((results) => {
                //     res.redirect('/exhibitions');
                // }).catch((err) => res.send(err));
        }).catch((err) => res.send(err));


});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});