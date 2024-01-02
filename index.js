const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const flash = require('express-flash');
const passport = require('passport');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )
const users = []

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Example if you're using EJS
app.use(express.urlencoded({ extended:false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'simeon',
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.listen(PORT, () => {
    console.log('Server is running on ${PORT}');
});



app.get('/', checkAuthentication, (req, res) => {
    res.render('home', { user: req.user.email });
    console.log(req.user.email);
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
    
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}));

app.get('/register', checkNotAuthenticated, (req, res) =>{
    res.render('register');
});

app.post('/register',   async (req, res) =>{
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

app.delete('/logout', (req, res) =>{
    req.logout()
    res.redirect('/login')
});

function checkAuthentication (req, res, next) {
    if (req.isAuthenticated) {
        return next()
    } else {
        res.redirect('/login');
    }
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated) {
        res.redirect('/');

    }
    return next()
}