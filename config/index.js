'use strict';

var development = require('./development.json'),
  production = require('./production.json');

module.exports = (function() {
  switch (process.env.NODE_ENV) {
  case 'development':
    return development;
  case 'production':
    return production;
  default:
    return development;
  }
}());