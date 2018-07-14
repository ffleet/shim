'use strict';

const shim = require('..');
const {run} = require('./helpers');

describe('wrap', () => {
	it('should have shim', () => {
		expect(shim.logs);
	});

	it('should report shimmed', () => {
		const handler = shim.cron(() => {});
		expect(handler).toHaveProperty('shimmed');
	});

	it('should provide a clean API', () => {
		let handler = (obj, callback) => {
			callback(null, obj);
		};
		handler = shim.logs(handler);

		const event = {
			awslogs: {
				data: "H4sIAAAAAAAAAHWPwQqCQBCGX0Xm7EFtK+smZBEUgXoLCdMhFtKV3akI8d0bLYmibvPPN3wz00CJxmQnTO41whwWQRIctmEcB6sQbFC3CjW3XW8kxpOpP+OC22d1Wml1qZkQGtoMsScxaczKN3plG8zlaHIta5KqWsozoTYw3/djzwhpLwivWFGHGpAFe7DL68JlBUk+l7KSN7tCOEJ4M3/qOI49vMHj+zCKdlFqLaU2ZHV2a4Ct/an0/ivdX8oYc1UVX860fQDQiMdxRQEAAA=="
			}
		};

		const decoded = {
			messageType: "DATA_MESSAGE",
			owner: "123456789123",
			logGroup: "testLogGroup",
			logStream: "testLogStream",
			subscriptionFilters: ["testFilter"],
			logEvents: [{
				id: "eventId1",
				timestamp: 1440442987000,
				message: "[ERROR] First test message"
			}, {
				id: "eventId2",
				timestamp: 1440442987001,
				message: "[ERROR] Second test message"
			}]
		};

		return run(handler, event)
			.then(res => {
				expect(res).toEqual(expect.objectContaining(decoded));
			});
	});
});
