
module.exports = function (json, callback) {
	// if we have no usage of hyperloop just return
	if (!json) { return callback(); }
	// map in our TiApp file
	json.classes.TiApp = {
		framework: 'Titanium',
		name: 'TiApp',
		methods: {
			app: {
				instance: false,
				name: 'app',
				arguments: [],
				selector: 'app',
				returns: {
					type: 'obj_interface',
					encoding: '@',
					value: 'TiApp *'
				}
			},
			getTiAppProperties: {
				instance: false,
				name: 'getTiAppProperties',
				arguments: [],
				selector: 'tiAppProperties',
				returns: {
					type: 'obj_interface',
					encoding: '@',
					value: 'NSDictionary *'
				}
			},
			getController: {
				instance: false,
				name: 'getController',
				arguments: [],
				selector: 'controller',
				returns: {
					type: 'obj_interface',
					encoding: '@',
					value: 'UIViewController *'
				}
			},
			showModalController: {
				instance: true,
				name: 'showModalController',
				selector: 'showModalController:animated:',
				arguments: [
					{
						type: 'obj_interface',
						encoding: '@',
						value: 'UIViewController *',
						name: 'controller'
					},
					{
						type: 'bool',
						encoding: 'B',
						value: 'BOOL',
						name: 'animated'
					}
				],
				returns: {
					type: 'void',
					encoding: 'v',
					value: 'void'
				}
			},
			hideModalController: {
				instance: true,
				name: 'hideModalController',
				selector: 'hideModalController:animated:',
				arguments: [
					{
						type: 'obj_interface',
						encoding: '@',
						value: 'UIViewController *',
						name: 'controller'
					},
					{
						type: 'bool',
						encoding: 'B',
						value: 'BOOL',
						name: 'animated'
					}
				],
				returns: {
					type: 'void',
					encoding: 'v',
					value: 'void'
				}
			},
			getUserAgent: {
				instance: true,
				name: 'getUserAgent',
				selector: 'userAgent',
				arguments: [],
				returns: {
					type: 'obj_interface',
					encoding: '@',
					value: 'NSString *'
				}
			},
			getSessionId: {
				instance: true,
				name: 'getSessionId',
				selector: 'sessionId',
				arguments: [],
				returns: {
					type: 'obj_interface',
					encoding: '@',
					value: 'NSString *'
				}
			},
			getRemoteDeviceUUID: {
				instance: true,
				name: 'getRemoteDeviceUUID',
				selector: 'remoteDeviceUUID',
				arguments: [],
				returns: {
					type: 'obj_interface',
					encoding: '@',
					value: 'NSString *'
				}
			},
			getLaunchOptions: {
				instance: true,
				name: 'getLaunchOptions',
				selector: 'launchOptions',
				arguments: [],
				returns: {
					type: 'obj_interface',
					encoding: '@',
					value: 'NSDictionary *'
				}
			},
			showModalError: {
				instance: true,
				name: 'showModalError',
				selector: 'showModalError:',
				arguments: [
					{
						type: 'obj_interface',
						encoding: '@',
						value: 'NSString *'
					}
				],
				returns: {
					type: 'void',
					encoding: 'v',
					value: 'void'
				}
			},
			startNetwork: {
				instance: true,
				name: 'startNetwork',
				selector: 'startNetwork',
				arguments: [],
				returns: {
					type: 'void',
					encoding: 'v',
					value: 'void'
				}
			},
			stopNetwork: {
				instance: true,
				name: 'stopNetwork',
				selector: 'stopNetwork',
				arguments: [],
				returns: {
					type: 'void',
					encoding: 'v',
					value: 'void'
				}
			},
			getWindowIsKeyWindow: {
				instance: true,
				name: 'getWindowIsKeyWindow',
				selector: 'windowIsKeyWindow',
				arguments: [],
				returns: {
					type: 'bool',
					encoding: 'b',
					value: 'BOOL'
				}
			}
		},
		properties: {
			userAgent: {
				name: 'userAgent',
				attributes: ['readonly'],
				type: {
					type: 'obj_interface',
					encoding: '@',
					value: 'NSString *'
				}
			},
			window: {
				name: 'window',
				attributes: ['readonly'],
				type: {
					type: 'obj_interface',
					encoding: '@',
					value: 'UIWindow *'
				}
			},
			userAgent: {
				name: 'sessionId',
				attributes: ['readonly'],
				type: {
					type: 'obj_interface',
					encoding: '@',
					value: 'NSString *'
				}
			},
			remoteDeviceUUID: {
				name: 'remoteDeviceUUID',
				attributes: ['readonly'],
				type: {
					type: 'obj_interface',
					encoding: '@',
					value: 'NSString *'
				}
			},
			launchOptions: {
				name: 'launchOptions',
				attributes: ['readonly'],
				type: {
					type: 'obj_interface',
					encoding: '@',
					value: 'NSDictionary *'
				}
			},
			windowIsKeyWindow: {
				name: 'windowIsKeyWindow',
				attributes: ['readonly'],
				type: {
					type: 'bool',
					encoding: 'B',
					value: 'BOOL'
				}
			}
		}
	};
	callback();
}
