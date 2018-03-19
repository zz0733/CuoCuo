@interface OCPhoneDevice : NSObject

+ (void)ApplePay: (NSString *) info;
+ (void)ReApplePayResult: (NSInteger) result : (NSString *) receipt;

+(NSString *)GetDeviceUUID;

@end
