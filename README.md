# httpd-mock for Node.js

This application creates a mock http server that supports static
files and webservices implementation providing a simple configuration file to
the application.

It also acts as a module that can run inside other applications.

## Usage
httpd-mock [-c, --config \<path\>] [-O, --output] [-p \<port\>] [-r \<rootpath\>]<br />
<br />
If you provide a configuration file and command line arguments that conflicts,
those arguments will override.

### Configuration file
A JSON file containing the following structure:
```js
{
    "serverRootPath": "./public", // default value
    "servicesPrefix": '/api/', // default value
    "jsonMocksPath": "./mocks/", // default value
    "output": "false", // default value
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
    .start();
```

### API
When used as a module an instance of the module will create a object with the
interface documented below.

#### new HtppdMock(options)
Creates the object. Set options. Object structure is the same as the config.

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

#### setOptions(options)
Set options. Object structure is the same as the config.

#### setServerRootPath(path)
Sets the root path of the server. Remember the server is static.
Any server side language won't be supported.

#### start(port || defaults to config || defaults to random)
Start the http server on the port received as argument, fallbacks to config, if
null fallbacks to random.

## TODO
\- Support different mock JSON files being returned when web service contains
variables in the path for bigger testing scope<br />
\- Implement other HTTP methods<br />
\- Shell command line to edit web services on the fly