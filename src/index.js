'use strict';

const isPromise = require('is-promise');

function shimmer(fn) {
	// return a function that wraps the provided shim function

	return handler => {
		// at this point, `handler` refers to the user provided function
		// that is to be shimmed by a library `fn`

		// if the handler is already shimmed, return it to prevent incompatible shims
		if (handler.shimmed) {
			return handler;
		}

		// shim the handler and mark it as shimmed
		handler = fn(handler);
		handler.shimmed = true;

		return handler;
	};
}

function wrap(fn) {
	return (event, context, callback) => {
		const newContext = {
			event,
			context,
			callback
		};

		// if handler is synchronous, exceptions will bubble up
		const result = fn.call(newContext, event, callback);

		// if the handler returned a promise, or is async
		if (isPromise(result)) {
			result.then(value => callback(null, value))
				.catch(err => callback(err));
			return;
		}

		return result;
	};
}
exports.wrap = shimmer(wrap);

function http(handler) {
	const binaryMimeTypes = [
		'application/javascript',
		'application/json',
		'application/octet-stream',
		'application/xml',
		'font/eot',
		'font/opentype',
		'font/otf',
		'image/jpeg',
		'image/png',
		'image/svg+xml',
		'text/comma-separated-values',
		'text/css',
		'text/html',
		'text/javascript',
		'text/plain',
		'text/text',
		'text/xml'
	];

	const awsExpress = require('aws-serverless-express');
	const crypto = require('crypto');
	const server = awsExpress.createServer(handler, null, binaryMimeTypes);

	// apply a random socket prefix to facilitate testing.
	// in production, the server runs in isolation so conflicts are not possible.
	server._socketPathSuffix = crypto.randomBytes(4).readUInt32BE();

	return (event, context) => {
		return awsExpress.proxy(server, event, context);
	};
}
exports.http = shimmer(http);
