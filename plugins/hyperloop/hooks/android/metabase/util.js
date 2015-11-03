/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
var chalk = require('chalk'),
	logger = {
		info: function () {
			console.log.apply(console, arguments);
		},
		debug: function () {
			console.log.apply(console, arguments);
		},
		trace: function () {
			console.log.apply(console, arguments);
		},
		warn: function () {
			console.log.apply(console, arguments);
		},
		error: function () {
			console.error.apply(console, arguments);
		}
	};

function createLogger(log, level) {
	log[level] && (logger[level] = function () {
		var args = Array.prototype.slice.call(arguments);
		log[level].call(log, chalk.magenta.inverse('[Hyperloop]') + ' ' + args.join(' '));
	});
}

function setLog (logFn) {
	['info','debug','warn','error','trace'].forEach(function (level) {
		createLogger(logFn, level);
	});
}

exports.setLog = setLog;

Object.defineProperty(exports, 'logger', {
	get: function () {
		return logger;
	}
});