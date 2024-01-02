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
const router = require('./router');
const initializePassport = require('./passport-config');
// initializePassport(
//     passport,
//     email => users.find(user => user.email === email),
//     id => users.find(user => user.id === id)
//     )

 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'ejs'); // Example if you're using EJS
//app.use(express.urlencoded({ extended:false }));
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

app.use('/', router);

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

app.listen(PORT, () => {
    console.log('Server is running on ${PORT}');
});