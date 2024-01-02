const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const path = require('path');

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )

    router.use(flash());
    router.use(express.static(path.join(__dirname, 'public')));
    router.use(session({ 
      secret: 'simeon',
      resave: false,
      saveUninitialized: false
    }));
    
    router.use(bodyParser.json());
    router.use(flash());
    router.use(passport.initialize());
    router.use(passport.session());
    router.use(methodOverride('_method'));
    
// router.use(express.urlencoded({ extended:false }));
// //router.set('views', path.join(__dirname, 'views'));
// //router.set('view engine', 'ejs'); // Example if you're using EJS
router.use(express.urlencoded({ extended:false }));

const users = []


router.get('/', checkAuthentication, (req, res) => {
    console.log(req.user.email);
    res.render('home', { user: req.user.email } );
    
});

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login', { messages : { error: 'This is an error message'}});
    
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}));


router.get('/register', checkNotAuthenticated, (req, res) =>{
    res.render('register');
});

router.post('/register',   async (req, res) =>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            email: req.body.email,
            password: hashedPassword,
            
        });
        res.render('login');
    } catch {
        res.redirect('/register')
    }
    console.log(users)
});

router.delete('/logout', (req, res) =>{
    req.logout()
    res.redirect('/login')
});

function checkAuthentication (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {

        res.redirect('/login');
    }
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');


    } else {
        console.log('There was an error');
    return next()
}
}

module.exports = router;