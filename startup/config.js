const config = require('config');

module.exports = function () {
  if (!config.get('APIServer')) {
    throw new Error('FATAL ERROR: APIServer is not defined.');
  }
}