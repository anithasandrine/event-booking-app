let err = new Error('You are not authorized.');
err.status = 401;

export function isSignedIn(req, res, next) {
  if (res.locals.options.type) return next();
  // Not authorized
  return res.status(err.status).render('error_views/auth-error', {
    error: err.message,
    link: '/'
  });
}

export function isadmin(req, res, next) {
  if (res.locals.options.type === 'admin') return next();
  // Not authorized
  return res.status(err.status).render('error_views/auth-error', {
    error: err.message,
    link: '/'
  });
}