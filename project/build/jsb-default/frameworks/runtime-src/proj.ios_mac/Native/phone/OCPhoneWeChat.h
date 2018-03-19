#import <Foundation/Foundation.h>

@interface OCPhoneWeChat : NSObject

+(void)WxLogin;
+(void)WxShareFriend: (NSString *) info;
+(void)WxShareCircle: (NSString *) info;
+(void)WxShareFriendScreen: (NSString *) fileName;

+ (void)WxReLogin: (NSString *) openid : (NSString *) token;
+ (void)WxReCancelLogin;
+ (void)WxReShareResult: (bool) result;

+ (bool)WxAppIsInstalled;

@end
