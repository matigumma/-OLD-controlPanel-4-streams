const passport = require('passport');
const passport_local = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new passport_local({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({email: email});
    if(!user){
        return done(null, false, {message: 'User no encontrado'});
    }else{
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Incorrect password'});
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) =>{
        done(err, user);
    });
})