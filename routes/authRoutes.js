const passport = require('passport');

module.exports = (app) => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'));

  // ketika user kesini, log out
  app.get('/api/logout', (req, res) => {
    // metode logout berasal dari passport, jadi tinggal ngancurin cookie
    req.logout();
    res.send(req.user);
  });

  // ketika ada get request, kasih data siapa yang log in
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
