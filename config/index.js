'use strict';

var convict = require('convict');
var conf = convict({
  env: {
    doc: 'The application environment',
    format: ['test','development','production'],
    default: 'development',
    env: 'NODE_ENV'
  },
  hostname: {
    doc: 'The application host name',
    format: String,
    default: 'localhost'
  },
  ipaddress: {
    doc: 'The application IP address to bind',
    format: 'ipaddress',
    default: '127.0.0.1'
  },
  port: {
    doc: 'The application port to bind',
    format: 'port',
    default: 0
  },
  logdir: {
    doc: 'The path application logging directories',
    format: String,
    default: ''
  },
  logfiles: {
    doc: 'The application log file names',
    error: {
      format: String,
      default: 'error.log'
    },
    info: {
      format: String,
      default: 'info.log'
    }
  }
});

var env = conf.get('env');
conf.loadFile( __dirname + '/' + env + '.json' );
conf.validate();
module.exports = conf;
