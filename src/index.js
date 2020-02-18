const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const flash = require('connect-flash');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();
const { appConfig, dbConfig } = require('./config/config');

//initializations
const app = express();
const connectDb = require('./database');
console.log(dbConfig);
setTimeout(()=>connectDb(dbConfig),60000);
require('./config/passport');
app.use(cors());
//settings
app.set('views', path.join(__dirname, 'views'));

var hba = hbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
 });
 
 hba._renderTemplate = function (template, context, options) {
 
    options.allowProtoMethodsByDefault = true;
    options.allowProtoPropertiesByDefault = true;
 
    return template(context, options);
 };

/* app.engine('.hbs',hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
})); */
app.engine('.hbs',hba);
app.set('view engine', '.hbs')

//middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(expressSession({
    secret: appConfig.secret,
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
    res.locals.error = req.flash('error');
    res.locals.msg_info = req.flash('msg_info');
    res.locals.user = req.user || null;
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

app.listen(appConfig.port, () => { 
    console.log('server on port', appConfig.port);
});
