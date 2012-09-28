#!/usr/bin/env node
var commander = require('commander'),
    nconf = require('nconf'),
    HttpdMock = require('./lib/httpd-mock');

if (!module.parent) {
    commander
        .version('0.2.1')
        .option('-c, --config [path]', 'Path to the configuration file')
        .option('-p, --port [port]', 'Port that the http mock server will use')
        .option('-r, --rootpath [path]', 'http mock server root path for static files')
        .parse(process.argv);
        
    if (commander.port) {
        nconf.overrides({'serverPort': commander.port});
    }
    
    if (commander.rootpath) {
        nconf.overrides({'serverRootPath': commander.rootpath});
    }

    new HttpdMock()
        .setConfigFile(commander.config)
        .setServerRootPath()
        .createWebServices()
        .start();
} else {
    exports = module.exports = new HttpdMock();
}