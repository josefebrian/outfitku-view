const config = require('config')
const axios = require('axios');
const cookieParser = require('cookie-parser')

const apiServer = config.get('APIServer');

module.exports = async function auth(req, res, next) {


  const token = req.cookies["x-auth-token"];

  if (!token && req.authPass) return next();
  if (!token) return res.status(401).send('Access denied. No token provided'); //nanti ganti pake pug

  try {
    const decoded = await axios({
      method: 'get',
      headers: {
        'x-auth-token': token,
      },
      url: apiServer + '/users/profile'
    })
    req.user = decoded.data;
    axios.defaults.headers.common["x-auth-token"] = token;


    next();
  } catch (ex) {

    req.user = false;
    next()
  }
}