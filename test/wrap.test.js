'use strict';

const shim = require('..');
const {run} = require('./helpers');

describe('wrap', () => {
	it('should have shim', () => {
		expect(shim.wrap);
	});

	it('should report shimmed', () => {
		let handler = (event, callback) => {
			callback(null, event.value);
		};
		handler = shim.wrap(handler);

		expect(handler).toHaveProperty('shimmed');

		return run(handler, { value: 3 })
			.then(res => {
				expect(res).toEqual(3)
			});
	});

	it('should not double shim', () => {
		let handler = (event, callback) => {
			callback(null, event.value);
		};

		expect(handler).not.toHaveProperty('shimmed');

		handler = shim.wrap(handler);

		expect(handler).toHaveProperty('shimmed');

		handler = shim.wrap(handler);
		handler = shim.wrap(handler);

		expect(handler).toHaveProperty('shimmed');

		return run(handler, { value: 3 })
			.then(res => {
				expect(res).toEqual(3)
			});
	});

	it('should shim promises', () => {
		const handler = shim.wrap((event, context) => {
			return new Promise((resolve, reject) => {
				resolve(event.value);
			});
		});

		expect(handler);

		const event = {
			value: 3
		};

		return run(handler, event)
			.then(res => {
				expect(res).toEqual(event.value);
			});
	});
});
