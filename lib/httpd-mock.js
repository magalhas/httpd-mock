'use strict';
var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var HttpdMock;
exports = module.exports = HttpdMock = function (options) {
  if (!this instanceof HttpdMock) {
    return new HttpdMock();
  }
  this.webServer = express();
  this.defaults = require('./httpd-mock.defaults');
  this.setOptions(options);
  this.namespace = {};
  return this;
};

HttpdMock.prototype.close = function () {
  this.getListener().close();
  return this;
};

HttpdMock.prototype.createWebServices = function (entities) {
  entities = entities || this.options.entities;
  var httpd = this.getInstance();
  var createServices = function (entity, options) {
    var namespace = this.namespace[entity];
    var idAttribute = options.idAttribute || '_id';
    var webServicePath = this.options.servicesPrefix + '/' + entity;
    // Creates the entity get services
    var createGetService = function () {
      if (this.options.output) console.log('GET ' + webServicePath);
      httpd.get(webServicePath, function (req, res) {
        if (this.options.output) console.log('GET ' + req.originalUrl);
        res.send(namespace);
      }.bind(this));
      if (this.options.output) console.log('GET ' + webServicePath + '/:id');
      httpd.get(webServicePath + '/:id', function (req, res) {
        if (this.options.output) console.log('GET ' + req.originalUrl);
        var id = req.params.id;
        var query = {};
        query[idAttribute] = id;
        var data = _.findWhere(namespace, query);
        if (data) res.send(data);
        else res.send(404);
      }.bind(this));
    }.bind(this);
    // Creates the entity post service
    var createPostService = function () {
      if (this.options.output) console.log('POST ' + webServicePath);
      httpd.post(webServicePath, function (req, res) {
        if (this.options.output) console.log('POST ' + req.originalUrl);
        var data = req.body;
        if (!data[idAttribute]) data[idAttribute] = Date.now();
        var query = {};
        query[idAttribute] = data[idAttribute];
        var existing;
        existing = _.findWhere(namespace, query);
        if (existing) {
          res.send(500, 'The id is already taken');
        } else {
          namespace.push(data);
          res.send(data);
        }
      }.bind(this));
    }.bind(this);
    // Creates the entity put service
    var createPutService = function () {
      if (this.options.output) console.log('PUT ' + webServicePath + '/:id');
      httpd.put(webServicePath + '/:id', function (req, res) {
        if (this.options.output) console.log('PUT ' + req.originalUrl);
        var id = req.params.id;
        var data = req.body;
        if (!data[idAttribute]) data[idAttribute] = id;
        var query = {};
        query[idAttribute] = id;
        var existing;
        existing = _.findWhere(namespace, query);
        if (existing) {
          for (var key in existing) delete existing[key];
          _.extend(existing, data);
          res.send(existing);
        } else
          res.send(404);
      }.bind(this));
    }.bind(this);
    var createDeleteService = function () {
      if (this.options.output) console.log('DELETE ' + webServicePath + '/:id');
      httpd.delete(webServicePath + '/:id', function (req, res) {
        if (this.options.output) console.log('DELETE ' + req.originalUrl);
        var id = req.params.id;
        var data;
        for (var i = 0, l = namespace.length; i < l; i++)
          if (namespace[i][idAttribute] === id) {
            data = namespace.splice(i, 1);
            break;
          }
        if (data) res.send(data);
        else res.send(404);
      }.bind(this));
    }.bind(this);
    createGetService();
    createPostService();
    createPutService();
    createDeleteService();
  }.bind(this);
  for (var entity in entities) {
    var options = entities[entity];
    this.prepareNamespace(entity, options);
    createServices(entity, options);
  }
  return this;
};

HttpdMock.prototype.getInstance = function () {
  return this.webServer;
};

HttpdMock.prototype.getListener = function () {
  return this.webServerListener;
};

HttpdMock.prototype.getPort = function () {
  return this.options.serverPort;
};

HttpdMock.prototype.prepareNamespace = function (entity, options) {
  if (options.defaults) {
    var defaults = require(path.resolve(process.cwd(), options.defaults));
    this.namespace[entity] = defaults;
  } else {
    this.namespace[entity] = [];
  }
};

HttpdMock.prototype.setConfigFile = function (file) {
  file = path.resolve(process.cwd(), file);
  if (file) this.options = _.defaults({}, require(file), this.options || {}, this.defaults || {});
  else this.setOptions();
  return this;
};

HttpdMock.prototype.setOptions = function (options) {
  this.options = _.defaults({}, options || {}, this.options || {}, this.defaults || {});
  return this;
};

HttpdMock.prototype.setServerRootPath = function (serverRootPath) {
  serverRootPath = serverRootPath || this.options.serverRootPath;
  this.getInstance().use(express.static(path.resolve(process.cwd(), serverRootPath)));
  return this;
};

HttpdMock.prototype.start = function (port) {
  port = port || this.options.serverPort;
  this.getInstance().use(bodyParser());
  this.setServerRootPath().createWebServices();
  this.webServerListener = this.getInstance().listen(port);
  this.options.serverPort = this.getListener().address().port;
  if (this.options.output) console.log('Http mock server listening on port ' + this.options.serverPort);
  return this;
};