const express = require('express');
const formidable = require('express-formidable');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const exhibitionRouter = require('./routes/exhibition.router');

app.use(formidable());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
    res.render('index', {title: 'Welcome to website for exhibition'});
});

app.use('/exhibitions', exhibitionRouter)

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});