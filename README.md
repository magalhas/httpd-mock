# httpd-mock for Node.js

This application creates a mock http server that supports static
files and webservices implementation providing a simple configuration file to
the application.

It also acts as a module that can run inside other applications.

## Usage
node index [-c path-to-configuration-file]

### Configuration file
A JSON file containing the following structure:
```js
{
    "serverRootPath": ".", // default value
    "servicesPrefix": '/webservice/', // default value
    "jsonMocksPath": "./mocks/", // default value
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
The web service URI can contain variables, for instance, "client/:id" would be
caught in a request to "client/123".

Only get and post methods are supported for the time being.

### Module usage example 
```js
var HttpdMock = require('httpd-mock'),
    httpdMock = new HttpdMock();
httpdMock
    .setConfigFile('pathtofile.json');
    .setServerRootPath()
    .createWebServices()
    .start();
```

### API
When used as a module an instance of the module will create a object with the 
interface documented below.

#### createWebServices(webServices)
Registers the web services received as argument, fallbacks to config.

#### getInstance()
Returns the express instance of the mock server.

#### getListener()
Returns the listener instance of the web server.

#### getPort()
Returns the port that the server is listening to.

#### setConfigFile(path)
Path to the config file.

#### setServerRootPath(path)
Sets the root path of the server. Remember the server is static.
Any server side language won't be supported.

#### start(port || defaults to config || defaults to random)
Start the http server on the port received as argument, fallbacks to config, if
null fallbacks to random.

## TODO
\- Support different mock JSON files being returned when web service contains
variables in the path for bigger testing scope<br />
\- Implement other HTTP methods