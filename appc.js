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
			},
			thirdparty: {
				'MyFramework': {
					// these can be an array or string
					source: ['src'],
					header: 'src',
					resource: 'src'
				}
			}
		}
	}
};
