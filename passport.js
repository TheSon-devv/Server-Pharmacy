const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: '756196421269-9kneaa6ec0clrjlab3fsifiootk9pblm.apps.googleusercontent.com',
    clientSecret: 'g8nDMcYTc_PiPKkIUxA-2Su0',
    callbackURL: "http://localhost:4000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
            console.log(profile,'profile');
            return done(null,profile)
        })
    }
));
