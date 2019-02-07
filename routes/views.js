const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
const auth = require('../middleware/auth');
const authPass = require('../middleware/authPass');
const apiServer = config.get('APIServer');


let defaultSiteValues = {
  judul: 'OUTFITKU',
  categories: '/categories',
  colorTheme: 'blue-grey darken-3',
  colorThemeText: 'teal',
  upPageLevel: '',

  link: {
    imgCDN: 'http://localhost:3000/public/img/',
    designer: '/designers',
    about: '/about',

  }
}


router.get('/', authPass, auth, async (req, res) => {
  let pageVariables = Object.assign(defaultSiteValues, { user: req.user });

  res.render('./home/home', pageVariables);

});
router.get('/designers', authPass, auth, async (req, res) => {
  let pageVariables = Object.assign(defaultSiteValues, { user: req.user });

  res.render('./designers/designers', pageVariables);

});

router.get('/profile', auth, async (req, res) => {
  let pageVariables = Object.assign(defaultSiteValues, { user: req.user });
  // console.log(req.user.name);

  try {
    const result = await axios.get(apiServer + '/users/' + req.user._id)
    pageVariables = Object.assign(defaultSiteValues, req.user);
    // console.log(result);

    res.render('./profile/profile', pageVariables);
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