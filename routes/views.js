const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
const auth = require('../middleware/auth');
const authPass = require('../middleware/authPass');
const apiServer = config.get('APIServer');


let defaultSiteValues = {
  siteName: 'Outfitku',
  categories: '/categories',
  colorTheme: 'blue-grey darken-3',
  colorThemeText: 'teal',
  upPageLevel: '',

  link: {
    imgCDN: 'http://localhost:3000/public/img/',
    imgCDNCategories: 'http://localhost:3000/public/img/categories/',
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

router.get('/profile/create_business', auth, async (req, res) => {
  try {


    const categories = await axios.get(apiServer + '/categories');

    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, categories: categories.data });
    // console.log(pageVariables.link.imgCDtegories + categories.data[0].mainImage);NCa

    const result = await axios.get(apiServer + '/users/' + req.user._id)
    pageVariables = Object.assign(defaultSiteValues, req.user, { upPageLevel: '../' });

    res.render('./profile/create_business', pageVariables);
  }
  catch (err) {
    res.status(err.response.status).send(err.response.data)
  };
});

router.post('/profile/create_business', auth, async (req, res) => {
  try {

    const designer = await axios.post(apiServer + '/designers/', req.body);


    res.send(req.body)
    // res.render('./profile/create_business', pageVariables);
  }
  catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

//FOR TESTING PURPOSE
router.get('/template', async (req, res) => {
  const pageVariables = Object.assign(defaultSiteValues, {});
  res.render('./materialize-template/aaa.html', pageVariables);

});


module.exports = router;