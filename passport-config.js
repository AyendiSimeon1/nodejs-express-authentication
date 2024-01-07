const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');

const GOOGLE_CLIENT_ID = '605060153601-t7vl849bm00f29gr94jhvdpgg77rbrab.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

const CALLBACKURL = 'http://localhost:3000/auth/google/callback';

const users = [];

function findOrCreate(userCritereia, newUser) {
    const user = users.find(u => u.googleId === userCritereia.googleId);

    if (user) {
        return user;
    } else {
        console.log('User Sign in was not successful');
    }
    users.push(newUser);
    return newUser;
}



function initialize (passport, getUserByEmail, getUserById) {
    const authenticateUser = async(email, password, done) => {
        const user = getUserByEmail(email) 
        if (user == null) {
            return done(null, false, { message: 'No user with this email'})
        }
         try  {
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect'})
            }
         } catch (e){
            return done(e)

         }
    }
    passport.use(new LocalStrategy ({ usernameField: 'email'},
    authenticateUser))
   

    passport.use(new GoogleStrategy({ 
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: CALLBACKURL, 
    },
    function(accessToken, refreshToken, profile, done) {
        const user = findOrCreate(
            { googleId: profile.id }, 
            { googleId: profile.id, name: profile.displayName }
        );
        done(null, user);
    }
    
  ));


  passport.serializeUser((user, done) =>  done(null, user.id))
  passport.deserializeUser((id, done)=> { 
      return done(null, getUserById(id))
  })

}
module.exports = initialize