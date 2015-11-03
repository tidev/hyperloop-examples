/**
 * Hyperloop configuration
 */
module.exports = {
	hyperloop: {
		ios: {
			xcodebuild: {
				/**
				 * any flags available to be passed into the Xcode can be
				 * included here to further customize the xcode build
				 */
				flags: {
					GCC_PREPROCESSOR_DEFINITIONS: 'foo=bar'
				},
				/**
				 * this sample doesn't use StoreKit but this demonstrates
				 * how you can bring in frameworks explicitly. Hyperloop
				 * will automatically determine the required frameworks
				 * but in case you want to force a specific version, you can
				 * include it here
				 */
				frameworks: [
					'StoreKit'
				]
			},
			/**
			 * optionally, you can bring in third-party or first-party libraries,
			 * source code, resources etc. by including them here. The 'key' is the
			 * name of the package that will be used in the require (if code).
			 * the values can either be an Array or String value to the directory
			 * where the files are located
			 */
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
