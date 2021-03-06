const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

// tambah cookie
// usernya adalah yang baru ditambahain ke database
passport.serializeUser((user, done) => {
  // user id adalah id milik mongo database, bikin serialize user pake mongo id
  // kenapa nggak pake google id? Karena bisa aja user pake auth fb, spotify, dkk
  // user.is diambil langsung nggak perlu pake _id segala macem yang ada di mongo
  // Oauth itu gunanya untuk signIn doang, setelah itu buat cookie, pake id sendiri
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    // Cari cookie yang ada di user, jadiin alat buat login
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    // ubah jadi async await
    async (accessToken, refreshToken, profile, done) => {
      // cara mastiin biar yang udah pernah auth ngga ke save 2 kali
      const existingUser = await User.findOne({googleId: profile.id});

      if (existingUser) {
        // We already have a record with the given profile ID
        return done(null, existingUser);
      }
      // Make new record to the database
      const user = await new User({googleId: profile.id}).save();
      done(null, user);
    }
  )
);
