'use strict';

function run(handler, event) {
	return new Promise((resolve, reject) => {
		const context = {
			callbackWaitsForEmptyEventLoop: true,
			functionName: 'testFunctionName',
			functionVersion: '$LATEST',
			invokedFunctionArn: '',
			memoryLimitInMB: 128,
			awsRequestId: '',
			logGroupName: '',
			logStreamName: ''
		};

		const callback = (err, value) => {
			if (err) return reject(err);
			resolve(value);
		};

		context.succeed = value => callback(null, value);
		context.fail = error => callback(error);

		try {
			handler(event, context, callback);
		} catch (e) {
			reject(e);
		}
	});
}
module.exports.run = run;
