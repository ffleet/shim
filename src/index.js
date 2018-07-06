'use strict';

function shimmer(fn) {
	// return a function that wraps each individual shim
	return handler => {
		// if the handler is already shimmed, pass it through
		if (handler.shimmed) {
			return handler;
		}

		// shim the handler and mark it as shimmed
		handler = fn(handler);
		handler.shimmed = true;

		return handler;
	};
}

function cron(handler) {
	return (event, context) => handler(event.time, event, context);
};
exports.cron = shimmer(cron);

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

	return (event, context) => awsExpress.proxy(server, event, context);
}
exports.http = shimmer(http);
