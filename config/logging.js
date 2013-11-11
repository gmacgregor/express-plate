/* jshint node: true */
'use strict';

var util = require('util'),
  winston = require('winston'),
  rotate = require('winston-filerotatedate'),
  config = require('./index');

var logTransports = [],
  logExceptionHandlers = [],
  logExitOnError = true,
   _1MB = 1048576;

var logdir = config.logs.dir;
if (!logdir || logdir === '') {
  var logdir = process.cwd() + '/log';
}

var logConfig = {
  levels: {
    silly: 0,
    verbose: 1,
    info: 2,
    data: 3,
    warn: 4,
    debug: 5,
    error: 6
  },
  colors: {
    silly: 'magenta',
    verbose: 'cyan',
    info: 'green',
    data: 'grey',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  }
};

function logTimestampFormat() {
  function pad(val) {
    if ( parseInt(val, 10) < 10 ) {
      val = '0' + val.toString();
    }
    return val;
  }

  var d = new Date();
  var h = d.getHours(),
    m = d.getMinutes(),
    s = d.getSeconds(),
    hours = (h+24-2)%24,
    mid = 'PM';

  if ( hours === 0 ) {
    hours = 12;
  }
  if ( hours <= 12 ) {
    mid = 'PM';
  }

  return util.format('%s:%s:%s %s', pad(h), pad(m), pad(s), mid);
}

// In development, log everything to the console
if (config.environment === 'development') {
  var devlogger = new winston.transports.Console({
    timestamp: logTimestampFormat,
    colorize: true,
    prettyPrint: true
  });
  logTransports.push( devlogger );
} else {
  // log to both console and file
  logTransports = [
    new winston.transports.Console({ level: 'info', timestamp: logTimestampFormat, colorize: true }),
    new winston.transports.FileRotateDate({
      filename: config.logging.info,
      timestamp: logTimestampFormat,
      dirname: logdir,
      maxsize: _1MB,
      json: false
    })
  ];
  logExceptionHandlers = [
    new winston.transports.Console({ level: 'error', timestamp: logTimestampFormat }),
    new winston.transports.FileRotateDate({
      filename: config.logging.error,
      timestamp: logTimestampFormat,
      dirname: logdir,
      maxsize: _1MB,
      json: false
    })
  ];
  // do not exit the program after logging an uncaughtException
  logExitOnError = false;
}

var options = {
  transports: logTransports,
  exceptionHandlers: logExceptionHandlers,
  exitOnError: logExitOnError,
  levels: logConfig.levels,
  colors: logConfig.colors
};

var logger = new winston.Logger(options);

module.exports = {
  logger: logger,
  config: options
};
