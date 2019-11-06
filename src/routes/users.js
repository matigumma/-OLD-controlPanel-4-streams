const router = require("express").Router();
const User = require('../models/User');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');

router.get('/users/list', isAuthenticated, async (req, res) => {
    const listado = await User.find();
    //console.log(listado);
    res.render('users/list', {listado,helpers: {// if_eq del checkbox
        if_eq: function (a, b, opts) {
            if (a == b)
                return opts.fn(this);
            else
                return opts.inverse(this);
        }
    }});
});

router.get('/users/edit/:id', isAuthenticated, async (req, res) => {
    const thisuser = await User.findById(req.params.id);
    //console.log(thisuser);
    res.render('users/user', {
        thisuser,
        helpers: {// if_eq del checkbox
        if_eq: function (a, b, opts) {
            if (a == b)
                return opts.fn(this);
            else
                return opts.inverse(this);
        }
    }});
});
//actualizar y borrar usuario:
router.put('/users/edit/:id', isAuthenticated, async (req, res) =>{
    const { name, email } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email }, function (err) { req.flash('msg_error', 'Error saving user changes to database'); res.redirect('/users/list'); });
    req.flash('msg_exito', 'Usuario modificado!');
    res.redirect('/users/list');
})

router.get('/users/delete/:id', isAuthenticated, async (req, res) =>{
    await User.findByIdAndDelete(req.params.id);
    req.flash('msg_info', 'Usuario borrado!');
    res.redirect('/users/list');
})
//---


router.get('/users/signin', async (req, res) => {
    //await User.deleteOne({"email": "matias@gmail.com"});
    //const listUsers = await User.find();
    //console.log(listUsers);
    res.render('users/signin', {helpers: {// if_eq del checkbox
        if_eq: function (a, b, opts) {
            if (a == b)
                return opts.fn(this);
            else
                return opts.inverse(this);
        }
    }});
});

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/camaras',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup', {helpers: {// if_eq del checkbox
        if_eq: function (a, b, opts) {
            if (a == b)
                return opts.fn(this);
            else
                return opts.inverse(this);
        }
    }});
});

router.post('/users/signup', async (req, res) =>{
    const { name, email, password, password_confirmation } = req.body;
    const errors = [];
    if (password != password_confirmation){
        errors.push({text: 'password do not match'});
    }
    if(password.length < 4){
        errors.push({text: 'password too short'});
    }
    if(errors.length > 0){
        res.render('users/signup',{errors, name, email});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('msg_error','El correo ya existe');
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save(function (err) { req.flash('msg_error', 'Error saving to database'); res.render('users/signup', { errors, name, email }) });
        req.flash('msg_exito', 'Success registry!');
        res.redirect('/users/signin');
    }
});

router.get('/users/signout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;