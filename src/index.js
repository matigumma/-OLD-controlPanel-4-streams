const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const methodOverride = require("method-override");
const expressSession = require("express-session");





//initializations
const app = express();
require('./database');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs',hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs')

//middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(expressSession({
    secret: 'l1c4ntr1s2ñ1s2cr2t1',
    resave: true,
    saveUninitialized: true
}));

//global vars
const Cam = require("./models/Camara");
Cam.find().sort({date: "desc"}).then((r)=>{
    const camlist = r;
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/camaras'));
app.use(require('./routes/anuncios'));
app.use(require('./routes/users'));

//static files
app.use(express.static(path.join(__dirname, 'public')))
//server listen..
app.listen(app.get('port'), () => { 
    console.log('server on port', app.get('port'));
});