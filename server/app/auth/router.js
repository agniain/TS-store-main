const router = require('express').Router();
const authController = require('./controller');
const passport = require('passport');
var LocalStrategy = require('passport-local');
const User = require('../user/model');
const { police_check } = require('../../middlewares');

passport.use(authController.strategy);
passport.use(new LocalStrategy(function verify(email, password, cb) {
    User.findOne({ email: email}, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (!user.verifyPassword(password)) { return cb(null, false); }
        return cb(null, user);
    })
}));

router.post('/register', authController.register);
router.post('/login', authController.login, 
    passport.authenticate('local'), function(req, res) {
    res.redirect('/')
    }
);

router.post('/logout', function (req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.json('ok');
      });
},
    authController.logout
);

router.get('/me', passport.authenticate('bearer', { session: false }), authController.me);

router.get(
    '/users', 
    passport.authenticate('bearer', { session: false }),
    police_check('read', 'User'),
    authController.index
);


module.exports = router;