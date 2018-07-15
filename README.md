# AWS Lambda Shim

[![CircleCI](https://img.shields.io/circleci/project/github/ffleet/shim.svg)](#readme)
[![npm](https://img.shields.io/npm/v/@ffleet/shim.svg)](https://www.npmjs.com/package/@ffleet/shim)

> A Better Lambda API

This library provides an abstraction between the AWS Lambda events and classic node.js calling conventions.

This project is sponsored by the Functional Fleet [Serverless Platform](https://ffleet.io). We are currently accepting beta users for our platform, featuring a free git repo, hosted deploy queue, and centralized monitoring.

## Why

AWS Lambda has a somewhat unintuitive API structure that is sometimes inconsistent with node.js standards. This library bridges the gap, allowing you to write more familiar node.js style code.

## Wrap

Wrapping your function standardizes the calling conventions across all versions of Node.js and all AWS Lambda event sources. This includes:

* Supporting Promise returns, rather than the callback argument
* Standardizing arguments to `(event, callback)`
* Providing additional helpers through the `this` object

Example:
```js
var shim = require('@ffleet/shim');
var myLib = require('./lib');

// callback is not needed with Promise
function myHandler(event) {
	// myLib.handle returns a promise
	return myLib.handle(event);
}

exports.myHandler = shim.wrap(myHandler);
```

## Libraries

The specific API shims below provide context specific APIs for certain Lambda events.

### HTTP

Node.js HTTP servers are built around `request` and `response` objects passing through route handlers. This has been embraced by the common node.js HTTP libraries as well (Express, Hapi, Restify, etc.).

The `http` shim creates a native node.js HTTP server and proxies the AWS Lambda event.

For example, using a native handler:
```js
const shim = require('@ffleet/shim');

function myNativeHttpHandler(req, res) {
	res.end('Hello, World!');
}

exports.myNativeHttpHandler = shim.http(myNativeHttpHandler);
```

Or, you can wrap an entire Express server:
```js
const shim = require('@ffleet/shim');
const express = require('express');
const app = express();

app.get('/', function(req, res, next) {
	res.send('Hello, World!');
});

exports.myExpressHttpHandler = shim.http(app);
```

### Cron

Cron functions are executed by AWS CloudWatch Events. Wrapping with the `cron` shim unpacks the event data and provides a `Date` object of when the cron event was generated.

```js
const shim = require('@ffleet/shim');

function myCron(date, callback) {
	console.log('cron event generated at ' + date.toISOString());
}
exports.myCron = shim.cron(myCron);
```

### Logs

AWS CloudWatch Log data is provided in a base64 encoded and gzip packed data string. The `logs` shim will decode the log data and reconstitute the represented JSON object, as:

```json
{
	"messageType": "DATA_MESSAGE",
	"owner": "123456789123",
	"logGroup": "testLogGroup",
	"logStream": "testLogStream",
	"subscriptionFilters": ["testFilter"],
	"logEvents": [{
		"id": "eventId1",
		"timestamp": 1440442987000,
		"message": "[ERROR] First test message"
	}, {
		"id": "eventId2",
		"timestamp": 1440442987001,
		"message": "[ERROR] Second test message"
	}]
}
```

Example:
```js
const shim = require('@ffleet/shim');

function myLogHandler(logObject, callback) {
	logObject.logEvents.forEach(logEvent => console.log('log', logEvent));
}
exports.myLogHandler = shim.logs(myLogHandler);
```
