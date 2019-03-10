const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
const auth = require('../middleware/auth');
const authPass = require('../middleware/authPass');
const apiServer = config.get('APIServer');
const _ = require('lodash');
const multer = require('multer')
const FormData = require('form-data'); //https://github.com/axios/axios/issues/1006#issuecomment-320165427


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
    order: '/orders',
    messages: '/messages',
    about: '/about',
    register: 'register',
    apiServer: config.get('APIServer')
  }
}

const upload = multer()

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
    if (!err.response) res.send(err.message)
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
    } else return res.render('./profile/profile', pageVariables);
  } catch (err) {
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


    // res.send(req.body)
    res.redirect(`/${designer._id}`);
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.get('/designers/:id/admin', auth, async (req, res) => {
  try {
    const designer = await axios.get(apiServer + '/designers/' + req.params.id);

    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, designer: designer.data, upPageLevel: '../../', postAction: `../../designers/${req.params.id}` });
    // console.log(req.user._id != designer.data.account.owner._id);

    if (req.user._id != designer.data.account.owner._id) return res.status(403).send('unauthorized')

    // res.send(templateItem.data)
    res.render('./designers/designer_backend', pageVariables);
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.get('/designers/:id/edit', auth, async (req, res) => {
  try {
    const designer = await axios.get(apiServer + '/designers/' + req.params.id);

    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, designer: designer.data, upPageLevel: '../../', postAction: `../../designers/${req.params.id}/edit` });
    // console.log(req.user._id != designer.data.account.owner._id);

    if (req.user._id != designer.data.account.owner._id) return res.status(403).send('unauthorized')

    // res.send(templateItem.data)
    res.render('./designers/designer_edit_detail', pageVariables);
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.post('/designers/:id/picture', [auth, upload.single('picture')], async (req, res) => {
  try {
    //kasih validation ada file/gak
    const formData = new FormData();
    formData.append('picture', `${req.file.originalname}`);
    formData.append('picture', req.file.buffer, `${req.file.originalname}`);
    const newHeader = Object.assign(axios.defaults.headers.common, formData.getHeaders());
    const postUrl = apiServer + '/designers/' + req.params.id + '/picture'

    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, upPageLevel: '../../', });
    const result = await axios.post(postUrl, formData, { headers: newHeader });

    res.redirect(req.get('referer'));
  } catch (err) {

    if (!err.response) return res.send(err.stack);
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.post('/designers/:id', auth, async (req, res) => {
  try {
    let pageVariables = Object.assign(defaultSiteValues, { user: req.user });
    const payload = Object.assign(req.body, {

    })
    const result = await axios.post(apiServer + '/designers/');


    res.redirect(req.get('referer'));
    // res.render('./xxxx/xxxx', pageVariables);
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.post('/designers/:id/order', auth, async (req, res) => {
  try {
    const designer = await axios.get(apiServer + '/designers/' + req.params.id);
    console.log(req.body);

    const order = await axios.post(apiServer + '/orders/', { designer: req.params.id, category: req.body.category });

    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, designer: designer.data, order: order.data, upPageLevel: '../../' });

    res.render('./designers/createOrder', pageVariables)
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.get('/designers/:id/orders/:orderId', auth, async (req, res) => {
  try {
    const designer = await axios.get(apiServer + '/designers/' + req.params.id);
    const order = await axios.get(apiServer + '/orders/' + req.params.orderId);
    const customer = order.data.user._id;

    let day = new Array(7);
    day[0] = "Sunday";
    day[1] = "Monday";
    day[2] = "Tuesday";
    day[3] = "Wednesday";
    day[4] = "Thursday";
    day[5] = "Friday";
    day[6] = "Saturday";

    let month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, order: order.data, designer: designer.data, upPageLevel: '../../../', day: day, month: month });

    if (req.user._id != designer.data.account.owner._id && req.user._id != customer) return res.status(403).send('unauthorized')

    res.render('./designers/viewOrder', pageVariables);
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.get('/myOrder', auth, async (req, res) => {
  try {
    const orders = await axios.get(apiServer + '/orders/');

    let day = new Array(7);
    day[0] = "Sunday";
    day[1] = "Monday";
    day[2] = "Tuesday";
    day[3] = "Wednesday";
    day[4] = "Thursday";
    day[5] = "Friday";
    day[6] = "Saturday";

    let month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, orders: orders.data, upPageLevel: '../../../', day: day, month: month, select: false });

    res.render('./designers/viewOrder', pageVariables);
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.get('/myOrder/:orderId', auth, async (req, res) => {
  try {
    const orders = await axios.get(apiServer + '/orders/');
    const order = await axios.get(apiServer + '/orders/' + req.params.orderId);
    console.log(order.data);

    let day = new Array(7);
    day[0] = "Sunday";
    day[1] = "Monday";
    day[2] = "Tuesday";
    day[3] = "Wednesday";
    day[4] = "Thursday";
    day[5] = "Friday";
    day[6] = "Saturday";

    let month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, order: order.data, orders: orders.data, upPageLevel: '../../../', day: day, month: month, select: true });

    res.render('./designers/viewOrder', pageVariables);
  } catch (err) {
    // res.status(err.response.status).send('error: ' + err.response.data)
    console.log(err);
  };
});

router.post('/designers/:id/orders/:orderId/messages', auth, async (req, res) => {
  try {
    const designer = await axios.get(apiServer + '/designers/' + req.params.id);
    const order = await axios.get(apiServer + '/orders/' + req.params.orderId);
    const message = await axios.post(apiServer + '/messages/' + req.params.orderId, { messageType: 'text', content: req.body.content })
    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, message: message.data, order: order.data, designer: designer.data, upPageLevel: '../../../../' });

    res.redirect(req.get('referer'));
    // res.send(templateItem.data)
  } catch (err) {
    res.status(err.response.status).send('error: ' + err.response.data)
  };
});

router.post('/designers/:id/orders/:orderId/messages/image', [auth, upload.single('content')], async (req, res) => {
  try {
    const designer = await axios.get(apiServer + '/designers/' + req.params.id);
    const order = await axios.get(apiServer + '/orders/' + req.params.orderId);

    const formData = new FormData();
    formData.append('content', `${req.file.originalname}`);
    formData.append('messageType', `image`)
    formData.append('content', req.file.buffer, `${req.file.originalname}`);
    console.log(formData);
    const newHeader = Object.assign(axios.defaults.headers.common, formData.getHeaders());
    const postUrl = apiServer + '/messages/' + req.params.orderId + '/image'
    const result = await axios.post(postUrl, formData, { headers: newHeader, messageType: 'image' });

    let pageVariables = Object.assign(defaultSiteValues, { user: req.user, message: result.data, order: order.data, designer: designer.data, upPageLevel: '../../../../../' });

    res.redirect(req.get('referer'));
  } catch (err) {
    if (!err.response) return res.send(err.stack);
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

router.get('/myorder', auth, async (req, res) => {



  res.render('./---------------------', pageVariables);
});

router.get('/myorder/:id', auth, async (req, res) => {

  let orderId = req.params.id;

  res.render('./----------------------', Object.assign(pageVariables, { orderId: req.params.id }));
});

module.exports = router;