const express = require('express');

const views = require('../routes/views');

module.exports = function(app) {
  app.set('view engine', 'pug')
  app.set('views', './views')

  app.use('/public', express.static('public'));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());



  app.use('', views);
};