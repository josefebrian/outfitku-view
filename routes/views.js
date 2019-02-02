const express = require('express');
const router = express.Router();

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

router.get('/', async (req, res) => {
  const pageVariables = Object.assign(defaultSiteValues, {});
  res.render('./home/home', pageVariables);

});

router.get('/categories', async (req, res) => {
  const pageVariables = Object.assign(defaultSiteValues, {});
  res.render('./home/categories', pageVariables);

});




module.exports = router;