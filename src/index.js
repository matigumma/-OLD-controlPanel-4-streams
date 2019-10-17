const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const flash = require('connect-flash');
const passport = require('passport');
//initializations
const app = express();
require('./database');
require('./config/passport');

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
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global vars
app.use((req, res, next) =>{
    res.locals.msg_exito = req.flash('msg_exito');
    res.locals.msg_error = req.flash('msg_error');
    res.locals.error = req.flash('error');//passport error
    res.locals.msg_info = req.flash('msg_info');
    res.locals.user = req.user || null;//passport user
    next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/camaras'));
app.use(require('./routes/anuncios'));
app.use(require('./routes/users'));
app.use(require('./routes/api'));

//static files
app.use(express.static(path.join(__dirname, 'public')))
//server listen..
app.listen(app.get('port'), () => { 
    console.log('server on port', app.get('port'));
});