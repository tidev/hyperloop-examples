void B (void(^Block)(int));
@interface A
-(void)do:(void(^)(int))it;
@end
typedef void (^MyBlock)(void);
@interface C
-(MyBlock)foo;
@end
