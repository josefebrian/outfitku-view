const express = require('express');
const router = express.Router();

let defaultSiteValues = {
  categories: '/categories',
  colorTheme: 'teal lighten-1',
  colorThemeText: 'teal',
  upPageLevel: ''
}

router.get('/categories', async (req, res) => {
  const pageVariables = Object.assign(defaultSiteValues, {});
  res.render('./home/categories', pageVariables);

});

module.exports = router;