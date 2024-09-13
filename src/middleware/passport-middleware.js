const passport = require('passport');
const { User } = require('../models/User.js');
const { SECRET_KEY } = require('../constants/index.js');
const { Strategy, ExtractJwt } = require('passport-jwt');

const opts = {
    secretOrKey: SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
    new Strategy(opts, async ({ id }, done) => {
        try {
            let user = await User.findById(id);
            if (!user) {
                return done(null, false, { message: 'User not found.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    })
);

module.exports = passport;
