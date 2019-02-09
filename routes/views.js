const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
const auth = require('../middleware/auth');
const authPass = require('../middleware/authPass');
const apiServer = config.get('APIServer');
const _ = require('lodash');

let defaultSiteValues = {
  siteName: 'Outfitku',
  categories: '/categories',
  colorTheme: 'blue-grey darken-3',
  colorThemeText: 'teal',
  upPageLevel: '',

  link: {
    imgCDN: config.get('imgCDN'),
    imgCDNCategories: config.get('imgCDN') + 'categories/',
    designer: '/designers',
    order: '/order',
    about: '/about',
    register: 'register',
    apiServer: config.get('APIServer')
  }
}


router.get('/', authPass, auth, async (req, res) => {
  let pageVariables = Object.assign(defaultSiteValues, { user: req.user });

  res.render('./home/home', pageVariables);

});

router.get('/register', authPass, auth, async (req, res) => {

  if (req.user) return res.send('anda sudah terdaftar');
  let pageVariables = Object.assign(defaultSiteValues, { user: req.user });

  res.render('./profile/register', pageVariables);

});

router.post('/register', authPass, auth, async (req, res) => {
  try {
    console.log(req.body);

    let pageVariables = Object.assign(defaultSiteValues, { user: req.body });

    const newUser = await axios.post(apiServer + '/users/', req.body);
    pageVariables = Object.assign(defaultSiteValues, req.user);
    console.log(req.body.name);

    res.render('./profile/register_success', pageVariables);
  } catch (err) {
    res.status(err.response.status).send(err.response.data)
  };


});

router.get('/designers', authPass, auth, async (req, res) => {
  try {

    const designers = await axios.get(apiServer + '/designers/');
    console.log(designers);

    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, designers: designers.data });

    // res.send(designers.data)
    res.render('./designers/designers', pageVariables);
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.get('/designers/:id', authPass, auth, async (req, res) => {
  try {
    const designer = await axios.get(apiServer + '/designers/' + req.params.id);
    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, designer: designer.data, upPageLevel: '../' });



    // res.send(templateItem.data)
    res.render('./designers/designer_page', pageVariables);
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.get('/profile', auth, async (req, res) => {
  let pageVariables = Object.assign(defaultSiteValues, { user: req.user, hasBusiness: false });

  try {
    const ownerOf = await axios.get(apiServer + '/designers/owner')


    pageVariables = Object.assign(defaultSiteValues, req.user);
    console.log('1', ownerOf.data);

    if (ownerOf.data) {
      console.log('2', ownerOf.data);
      pageVariables = Object.assign(pageVariables, { business: ownerOf.data, hasBusiness: true });
      return res.render('./profile/profile', pageVariables);
    }

    else return res.render('./profile/profile', pageVariables);
  }
  catch (err) {
    console.log(ownerOf.data);
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
  } catch (err) {
    res.status(err.response.status).send(err.response.data)
  };
});

router.post('/profile/create_business', auth, async (req, res) => {
  try {

    const designer = await axios.post(apiServer + '/designers/', req.body);


    res.send(req.body)
    // res.render('./profile/create_business', pageVariables);
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.get('/designers/:id/admin', auth, async (req, res) => {
  try {
    const designer = await axios.get(apiServer + '/designers/' + req.params.id);

    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, designer: designer.data, upPageLevel: '../../' });
    // console.log(req.user._id != designer.data.account.owner._id);

    if (req.user._id != designer.data.account.owner._id) return res.status(403).send('unauthorized')

    // res.send(templateItem.data)
    res.render('./designers/designer_backend', pageVariables);
  }
  catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.post('/designers/:id/picture', auth, async (req, res) => {
  try {
    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, upPageLevel: '../../' });
    // const designers = await axios.get(link.apiServer + '/designers')
    console.log(req.files);

    //ATURRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRW

    res.send(req.body)
    // res.render('./xxxx/xxxx', pageVariables);
  }
  catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.get('/designers/:id/orders/:orderId', auth, async (req, res) => {
  try {
    const designer = await axios.get(apiServer + '/designers/' + req.params.id);
    const order = await axios.get(apiServer + '/orders/' + req.params.orderId);
    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, order: order.data, designer: designer.data, upPageLevel: '../../../' });

    // res.send(templateItem.data)
    res.render('./designers/inputOrder', pageVariables);
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

//FOR TESTING PURPOSE
router.get('/template', async (req, res) => {
  const pageVariables = Object.assign(defaultSiteValues, {});
  res.render('./materialize-template/aaa.html', pageVariables);

});
//TEMPLATE ROUTE
router.get('/templateRoute', auth, async (req, res) => {
  try {
    let pageVariables = Object.assign(defaultSiteValues, { user: req.user });
    const templateItem = await axios.get(apiServer + '/templateItem/');


    res.send(templateItem.data)
    // res.render('./xxxx/xxxx', pageVariables);
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

module.exports = router;