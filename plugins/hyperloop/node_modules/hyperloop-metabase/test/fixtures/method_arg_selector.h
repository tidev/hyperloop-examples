@interface A
-(void)initWithFoo:(SEL)sel;
@end

@interface B
-(A)foo:(A)foo bar:(SEL)sel c:(int)d;
@end
