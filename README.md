# httpd-mock for NodeJS

This application creates a mock http server on localhost that supports static
files and webservices implementation providing a simple configuration file to
the application.

It also acts as a module that can run inside other applications.

## External dependencies
phantomjs v1.6.0

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

## Running
node index [-c <path-to-configuration-file>]