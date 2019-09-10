/**
 * Hyperloop configuration
 */
module.exports = {
  type: 'app',
  group: 'titanium',
  dependencies: {},
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
         * this sample doesn't use SceneKit but this demonstrates
         * how you can bring in frameworks explicitly. Hyperloop
         * will automatically determine the required frameworks
         * but in case you want to force a specific version, you can
         * include it here
         */
        frameworks: [
          'SceneKit'
        ],

        scripts: [{
          name: 'My script phase',
          shellScript: '${APPC_PROJECT_DIR}/run-script.sh'
        }]
      }
    }
  }
};
