# httpd-mock for NodeJS

This application creates a mock http server on localhost that supports static
files and webservices implementation providing a simple configuration file to
the application.

It also acts as a module that can run inside other applications.

## Configuration file
A JSON file containing the following structure:
```js
{
    "serverRootPath": ".",
    "servicesPrefix": '/webservice/',
    "jsonMocksPath": "./mocks/",
    "webServices": {
        "get": {
            "YOUR_WEBSERVICE_URI": "WEBSERVICE_JSON_RESULT_FILE.json",
            "YOUR_WEBSERVICE_URI": "WEBSERVICE_JSON_RESULT_FILE.json"
        },
        "post": {
			"YOUR_WEBSERVICE_URI": "WEBSERVICE_JSON_RESULT_FILE.json",
            "YOUR_WEBSERVICE_URI": "WEBSERVICE_JSON_RESULT_FILE.json"
		}
	}
}
```

## Running as a process
node index [-c path-to-configuration-file]

## Running as a 
```js
var HttpdMock = require('httpd-mock'),
    httpdMock = new HttpdMock();
httpdMock
    .setConfigFile(commander.config)
    .setServerRootPath()
    .createWebServices()
    .start();
```

### API
#### httpdMock.createWebServices(webServices)
Registers the web services received as argument, fallbacks to config.

#### httpdMock.setConfigFile(path)
Path to the config file

#### httpdMock.setServerRootPath(path)
Sets the root path of the server. Remember the server is static, so only static
files (.html, .js, .css, etc). Any server side language won't be supported.

#### httpdMock.start(port)
Start the http server on the port received as argument, fallbacks to config.