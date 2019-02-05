const express = require('express');
const cookieParser = require('cookie-parser')
const views = require('../routes/views');
const auth = require('../routes/auth');
module.exports = function (app) {
  app.set('view engine', 'pug')
  app.set('views', './views')

  app.use('/public', express.static('public'));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser())


  app.use('', views);
  app.use('/login', auth);
};