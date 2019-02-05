

const _ = require('lodash')
const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');

const apiServer = config.get('APIServer');

router.post('/', async (req, res) => {
  // console.log(req.cookies.x_auth_token)
  //send api req
  const userUrl = apiServer + '/auth'

  try {
    const result = await axios.post(userUrl, {
      email: req.body.email,
      password: req.body.password
    })
    // console.log(result.data);

    if (req.query.remember) {
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
  //recieve resp
  //error response
  //response back to client

  // const validPassword = await bcrypt.compare(req.body.password, user.password)
  // if (!validPassword) return res.status(404).send('Invalid username or password...');

  // const token = user.generateAuthToken();
  // if (req.body.remember) {
  //   res.cookie('x_auth_token', token, { maxAge: 86400000 });
  // }
  // else {
  //   res.cookie('x_auth_token', token, { maxAge: 518400000 });
  // }

  // res.status(200).send('login successful')
});
router.get('/logout', async (req, res) => {
  res.clearCookie("x_auth_token")
  res.redirect('/')

});

module.exports = router;