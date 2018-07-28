# Hyperloop Examples

The following application demonstrates direct native API access using Appcelerator Hyperloop.

Learn more about Hyperloop [here](http://www.appcelerator.com/mobile-app-development-products/hyperloop/)!

## Requirements

- [x] Titanium SDK 7.0.0+
- [x] Hyperloop 3.0.1+
- [x] Alloy 1.9.0+

## Optional Requirements

- [x] Gradle 4.4+

## Running this app

*BEFORE* attempting to run this application, ensure that you have downloaded and followed the instructions from the appropriate guide below. 
There are specific prerequisites that must be first met before this application will run properly. Also make sure you [enabled Hyperloop](http://docs.appcelerator.com/platform/latest/#!/guide/Enabling_Hyperloop) before getting started.

This sample application only runs on the simulator because it uses a demo application GUID. If you want to run this application on device, 
you need to import the application into your own platform account using `appc new --import`.

### iOS

You can download the [iOS Programming Guide](http://docs.appcelerator.com/platform/latest/#!/guide/iOS_Hyperloop_Programming_Guide) for information on running this demo application 
for iOS and learning how to use Hyperloop in your own project.

### Android

You can download the [Android Programming Guide](http://docs.appcelerator.com/platform/latest/#!/guide/Android_Hyperloop_Programming_Guide) for information on running this demo application 
for Android and learning how to use Hyperloop in your own project. To use the `build.gradle`, run `gradle getDeps` from Terminal and it will install the example 
dependency (Volley) to `app/platform`. Note: We ship the volley-1.1.0.aar with this project already, so developer do not need to run Gradle manually. 
In the future, Gradle will be handled from Hyperloop directly, like CocoaPods on iOS!

### Windows

Hyperloop 2.1.0+ includes the Hyperloop Windows and it requires Titanium SDK 6.1.0+.
You can download the [Windows Programming Guide](http://docs.appcelerator.com/platform/latest/#!/guide/Windows_Hyperloop_Programming_Guide) for information on running this demo application f
or Windows and learning how to use Hyperloop in your own project.

## License

This content here is provided on an "as is" basis without any official support or warranty. Source and object code is Copyright &copy; 2015-present by Appcelerator, Inc. All Rights Reserved. 
Permission to use the example source code (such as Alloy views, controllers, etc) in your own application is expressly granted. 
Hyperloop is a registered trademark of Appcelerator, Inc. 
