/**
 * This is a simple example of adding support for third-party source
 */

#import "MyClass.h"

@implementation MyClass

-(instancetype)init {
	// logo will be copied because we includes a 'resource' directory in our appc.js
	// which will compile / copy any resources provided in that directory
	UIImage *image = [UIImage imageNamed:@"logo.png"];
	return [self initWithImage:image];
}

@end
