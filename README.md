# Serverless Shim

![CircleCI](https://img.shields.io/circleci/project/github/ffleet/shim-js.svg)
[![npm](https://img.shields.io/npm/v/@ffleet/shim.svg)](https://www.npmjs.com/package/@ffleet/shim)

AWS Lambda Node.js Shim Library

## Why

Each of the serverless cloud providers has different requirements for how functions are called.
In most cases, these standards deiverge from what developers are used to.

For example, AWS HTTP node.js functions have a signature of `function (event, context, done) {...}`
where node.js developers have built a vast number of libraries that work with HTTP servers
as `function (req, res) {...}`.

This library bridges the gap by providing serverless callbacks native to the platform and context.

## How

This library exposes a number of functions that wrap the developer provided handler, exposing a common
function signature for each context and abstracting the backend cloud requirements.

## Example

```js
const shim = require('@ffleet/shim');

function myNativeHttpHandler(req, res) {
	res.end('Hello, World!');
}
exports.myNativeHttpHandler = shim.http(myNativeHttpHandler);

const express = require('express');
const app = express();
app.get('/', function(req, res, next) {
	res.send('Hello, World!');
});
exports.myExpressHttpHandler = shim.http(app);
```
