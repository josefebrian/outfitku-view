

const _ = require('lodash')
const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');

const apiServer = config.get('APIServer');

router.post('/login', async (req, res) => {
  // console.log(req.cookies.x_auth_token)
  //send api req
  const userUrl = apiServer + '/auth'

  try {
    const result = await axios.post(userUrl, {
      email: req.body.email,
      password: req.body.password
    })
    // console.log(result.data);

    axios.defaults.headers.common["x-auth-token"] = result.data;

    if (req.body.remember) {
      res.cookie('x_auth_token', result.data, { maxAge: 86400000 });
    }
    else {
      res.cookie('x_auth_token', result.data, { maxAge: 518400000 });
    }

    res.redirect('/');
  }
  catch (err) {
    // res.status(err.response.status).send(err.response.data)
    res.send(err.message)
  };

});
router.get('/logout', async (req, res) => {
  res.clearCookie("x_auth_token")
  delete req.user
  res.render('./profile/logout', {
    judul: 'OUTFITKU',
    categories: '/categories',
    colorTheme: 'blue-grey darken-3',
    colorThemeText: 'teal',
    upPageLevel: '',
  })

});

module.exports = router;