#!/usr/bin/env node
var pkg = require("../package.json"),
    commander = require("commander"),
    HttpdMock = require("../lib/httpd-mock");

commander
    .version(pkg.version)
    .option("-c, --config <path>", "Path to the configuration file")
    // @todo Control other output modes besides console
    .option("-O, --show-output", "flag to enable output, useful if you don't specify a port")
    .option("-p, --port <port>", "Port that the http mock server will use [random]")
    .option("-r, --rootpath <path>", "http mock server root path for static files [./public]")
    .parse(process.argv);

var options = {};
commander.port && (options.serverPort = commander.port);
commander.rootpath && (options.serverRootPath = commander.rootpath);
commander.showOutput && (options.output = commander.showOutput);

new HttpdMock(options)
    .setConfigFile(commander.config)
    .start();