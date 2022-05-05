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

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});