
@protocol B
-(void)b;
@end

@interface C
-(void)a;
@end

@interface A : C <B>
-(void)a;
-(void)b;
@end
