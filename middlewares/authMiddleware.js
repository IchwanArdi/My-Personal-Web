function ensureAuthenticated(req, res, next) {
  console.log('Cek session:', req.session.user);
  if (req.session.user) {
    return next();
  }
  return res.redirect('/login');
}

module.exports = { ensureAuthenticated };
