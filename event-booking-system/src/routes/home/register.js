import express from 'express';
import User from '../../models/user';

const router = express.Router();

router.use(
  ['/register', '/user-register', '/admin-register'], (req, res, next) => {
    res.locals.options.page = 'register';
    next();
  });

// pre-register page
router.get('/register', (req, res) => {
  res.render('pre-register', res.locals.options);
});

// user-register form
router.get('/user-register', (req, res) => {
  res.locals.options.register_type = 'user';
  res.render('register', res.locals.options);
});

// admin-register form
router.get('/admin-register', (req, res) => {
  res.locals.options.register_type = 'admin';
  res.render('register', res.locals.options);
});

const checkRegisterError = async (username, email) => {
  let userNameCount = await User.count({ username });
  let emailCount = await User.count({ email });
  let err;
  if (userNameCount || emailCount) {
    if (userNameCount) {
      err = new Error('Username already exists.');
    } else {
      err = new Error('Email already exists.');
    }
    err.status = 409;
  }
  return err;
};

// handle form submission for user
router.post('/user-register', async (req, res, next) => {
  const { username, email, password } = req.body;
  const userType = 'user';
  const err = await checkRegisterError(username, email);
  if (err) {
    return res.status(err.status).render('error_views/auth-error',
      { error: err.message, link: '/user-register' });
  }
  User.create({
    username, email, password, userType
  })
    .then(user => {
      req.session.username = user.username;
      res.redirect('/');
    })
    .catch(err => {
      next(err);
    });
});

// handle form submission for admin
router.post('/admin-register', async (req, res, next) => {
  const { username, email, password } = req.body;
  const userType = 'admin';
  const err = await checkRegisterError(username, email);
  if (err) {
    return res.status(err.status).render('error_views/auth-error',
      { error: err.message, link: '/admin-register' });
  }
  User.create({
    username, email, password, userType
  })
    .then(user => {
      req.session.username = user.username;
      res.redirect('/');
    })
    .catch(err => {
      next(err);
    });
});


export default router;