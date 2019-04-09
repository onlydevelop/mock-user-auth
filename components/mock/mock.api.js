const express = require('express');
const ctrl = require('./mock.controller');
const router = express.Router();

router.post('/auth', (req, res) => {
  const { email, password } = req.body;
  ctrl.isAuthenticated(email, password).then(response => {
    if (!response) res.status(401).json({ message : 'Incorrect email or password'});
    const id = response;
    const access_token = ctrl.createToken({ email, id });
    res.status(200).json({ token: access_token });
  });
});

router.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  const imageUrl = 'https://almsaeedstudio.com/themes/AdminLTE/dist/img/user2-160x160.jpg';
  ctrl.postUser(name, email, password, imageUrl)
    .then((response) => {
      if (!response.data) return res.status(401).json({ message: 'User already registered' });
      const id = response;
      const access_token = ctrl.createToken({ email, id });
      res.status(200).json({ message: 'User registered with success', token: access_token });
    })
    .catch(err => {
      throw err;
    });
});

router.get('/users', (req, res) => {
  const authorization = 'authorization';
  const token = req.body.token || req.query.token || req.headers[authorization];
  ctrl.getUser(token)
    .then(response => {
      console.log('Response: ', response);
      if (!response.status) return res.status(401).json({ message: response.data });
      res.status(200).json({ message: 'Get user authorized', data: response.data });
    })
    .catch(err => {
      throw err;
    });
});

module.exports = router;
