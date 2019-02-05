const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
const auth = require('../middleware/auth');

const apiServer = config.get('APIServer');


let defaultSiteValues = {
  judul: 'OUTFITKU',
  categories: '/categories',
  colorTheme: 'blue-grey darken-3',
  colorThemeText: 'teal',
  upPageLevel: '',

  link: {
    imgCDN: 'http://localhost:3000/public/img/',
    designer: '/designer',
    about: 'about',

  }
}


router.get('/', auth, async (req, res) => {
  let pageVariables = Object.assign(defaultSiteValues, { user: req.user });

  try {
    const result = await axios.get(apiServer + '/categories')

    res.render('./home/home', pageVariables);
  }
  catch (err) {
    res.status(err.response.status).send(err.response.data)
  };
});

//FOR TESTING PURPOSE
router.get('/template', async (req, res) => {
  const pageVariables = Object.assign(defaultSiteValues, {});
  res.render('./materialize-template/aaa.html', pageVariables);

});


module.exports = router;