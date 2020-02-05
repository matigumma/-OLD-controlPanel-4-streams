const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        console.log('Acceso concedido')
        return next();
    }else{
        console.log('Acceso restringido')
        req.flash('msg_error', 'Acceso restringido');
        res.redirect('/users/signin');
    }
}

module.exports = helpers;