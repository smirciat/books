var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.setup = function (User, config) {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(accessToken + " Fuck you Google! " + profile);
      User.findOne({
        'google.id': profile.id
      }, function(err, user) {
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.emails[0].value.split('@')[0],
            provider: 'google',
            google: profile._json
          });
          user.save(function(err) {
            if (err) return done(err);
            done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));
};
