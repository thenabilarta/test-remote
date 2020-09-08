const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./models/User');
require('./services/passport');
// bisa kayak gini juga nulisnya, tapi biar lebih singkat ditulis seperti yang dibawah
// const authRoutes = require('./routes/authRoutes');

// npm install cookie session

mongoose.connect(keys.mongoURI);

const app = express();

app.use(
  // bikin cookie
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

// nyambungin passport sama cookie session, jadi cookie itu pake passport
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// authRoutes(app);
require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT);

// mongodb+srv://jaewon:jaewon@cluster0.m5h0k.mongodb.net/emailyprod?retryWrites=true&w=majority
