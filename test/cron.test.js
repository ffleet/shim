'use strict';

const shim = require('..');
const {run} = require('./helpers');

describe('wrap', () => {
	it('should have shim', () => {
		expect(shim.cron);
	});

	it('should report shimmed', () => {
		let handler = (date, callback) => {
			callback(null, date);
		};
		handler = shim.cron(handler);

		expect(handler).toHaveProperty('shimmed');
	});

	it('should provide a clean API', () => {
		let handler = (date, callback) => {
			callback(null, date);
		};
		handler = shim.cron(handler);

		const date = new Date(Date.parse('2018-07-14T14:30:20Z'));
		expect(date.getFullYear()).toEqual(2018);

		return run(handler, { time: date.toISOString() })
			.then(res => {
				expect(res.getTime()).toEqual(date.getTime())
			});
	});
});
