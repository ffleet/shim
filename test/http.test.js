'use strict';

const shim = require('..');

function run(handler, event) {
	return new Promise((resolve, reject) => {
		try {
			let server;

			const context = {
				succeed: (res) => {
					server.close();
					resolve(res);
				}
			};

			server = handler(event, context);
		} catch (e) {
			reject(e);
		}
	});
}

describe('http', () => {
	it('should have shim', () => {
		expect(shim.http);
	});

	it('should report shimmed', () => {
		const handler = shim.http((req, res) => {});
		expect(handler).toHaveProperty('shimmed');
	});

	it('should shim lambda to http', () => {
		const handler = shim.http((req, res) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain');
			res.end('Hello, World!');
		});

		expect(handler);

		const event = {
			path: '/foo',
			httpMethods: 'GET',
			body: 'Hello, World!',
			headers: {
				'x-foo': 'foo'
			}
		};

		return run(handler, event)
			.then(res => {
				expect(res.statusCode).toEqual(200);
				expect(atob(res.body)).toEqual("Hello, World!");
			});
	});

	it('should not double-shim', () => {
		let handler = (req, res) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain');
			res.end('Hello, World!');
		};

		expect(handler).toHaveProperty('shimmed', undefined);
		handler = shim.http(handler);
		expect(handler).toHaveProperty('shimmed', true);
		handler = shim.http(handler);
		expect(handler).toHaveProperty('shimmed', true);
		handler = shim.http(handler);
		expect(handler).toHaveProperty('shimmed', true);

		const event = {
			path: '/',
			httpMethods: 'GET',
			body: 'Hello, World',
			headers: {}
		};

		return run(handler, event)
			.then(res => {
				expect(atob(res.body)).toEqual('Hello, World!');
			});
	});
});
