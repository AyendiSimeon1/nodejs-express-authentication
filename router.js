const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-strategy').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const path = require('path');
const { sendConfirmationEmail } = require('./email-config');

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id),
    
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
    
router.use(express.urlencoded({ extended:false }));
router.use(express.urlencoded({ extended:false }));

const users = []


router.get('/', checkAuthentication, (req, res) => {
    console.log(req.user.email);
    res.render('home', { user : req.user.email } );
    
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

// Route to start the Google oauth process
// router.get('/auth/google', passport.authenticate('google', {
//     scope: ['profile', 'email']
//     }));

    router.get('/auth/google', (req, res, next) => {
        passport.authenticate('google', { scope: ['profile', 'email'] }, (err, user, info) => {
          if (err) {
            // Handle the error
            return res.status(500).send(err);
          }
          // Proceed with authentication
        })(req, res, next);
      });
// Route for successfull google authentication

router.get('/auth/google/callback',  passport.authenticate('google', {
    failureRedirect : '/login'

}), (req, res) => {
    res.redirect('/');
});

router.post('/register',   async (req, res) =>{
    // passport.authenticate('local-signup', (err, user, info) => {
    //     if(err) {
    //         return next(err);
    //     } else (!user) {
    //         return res.status(400).json({ message:info.message});
    //     }
         
    //     users.confirmationCode = confirmationCode;



    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const confirmationCode = '44993333';
        users.push({
            id: Date.now().toString(),
            email: req.body.email,
            password: hashedPassword,
            confirmationCode: confirmationCode,
            
        });
        // const userEmail = users.email;
        // console.log('This is your user email' + userEmail);
        // sendConfirmationEmail('mrayendi1@gmail.com', confirmationCode, (err, info) => {
        //     if(err) {
        //         console.log('Error:', err);
        //     } else {
        //         console.log('Successful:', info.response);
        //     }
        // });
        // Some
        //A text comment
        //Now is the time
        
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