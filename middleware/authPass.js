const config = require('config')
const axios = require('axios');
const cookieParser = require('cookie-parser')

const apiServer = config.get('APIServer');

module.exports = async function auth(req, res, next) {
  req.authPass = true;
  next();
}