/**
 * Hyperloop configuration
 */
module.exports = {
	hyperloop: {
		ios: {
			xcodebuild: {
				flags: {
					GCC_PREPROCESSOR_DEFINITIONS: 'foo=bar'
				},
				frameworks: [
					'StoreKit'
				]
			}
		}
	}
};
