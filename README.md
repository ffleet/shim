# AWS Lambda Shim

[![CircleCI](https://img.shields.io/circleci/project/github/ffleet/shim-js.svg)](#readme)
[![npm](https://img.shields.io/npm/v/@ffleet/shim.svg)](https://www.npmjs.com/package/@ffleet/shim)

This library provides an abstraction between the AWS Lambda events and classic node.js calling conventions.

This project is sponsored by the Functional Fleet [Serverless Platform](https://ffleet.io).

## Why

Node.js has developed a familiar set of patterns for certain sets of problems. AWS Lambda, however, uses a slightly different structure in order to maximize flexibility for the Lambda platform. This library bridges the gap, allowing you to write common node.js style code which is automatically translated for use in AWS serverless environments.

## Support

This library supports all versions of node.js that are currently supported by AWS Lambda. Currently, that includes:
* node.js 4.3
* node.js 6.10
* node.js 8.10

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
function mySQSHandler(event) {
	// myLib.handle returns a promise
	return myLib.handle(event);
}

exports.mySQSHandler = shim.wrap(mySQSHandler);
```

## Libraries

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
