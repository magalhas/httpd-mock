#!/usr/bin/env node
var commander = require("commander"),
    nconf = require("nconf"),
    HttpdMock = require("./lib/httpd-mock");

if (!module.parent) {
    commander
        .version("0.2.3")
        .option("-c, --config [path]", "Path to the configuration file")
        .option("-p, --port [port]", "Port that the http mock server will use")
        .option("-r, --rootpath [path]", "http mock server root path for static files")
        // @todo Control other output modes besides console
        .option("-o, --output", "flag to enable output, useful if you don't specify a port")
        .parse(process.argv);

    if (commander.port) {
        nconf.overrides({"serverPort": commander.port});
    }
    if (commander.rootpath) {
        nconf.overrides({"serverRootPath": commander.rootpath});
    }
    if (commander.output) {
        nconf.overrides({"output": commander.output);
    }

    new HttpdMock()
        .setConfigFile(commander.config)
        .setServerRootPath()
        .createWebServices()
        .start();
} else {
    exports = module.exports = HttpdMock;
}