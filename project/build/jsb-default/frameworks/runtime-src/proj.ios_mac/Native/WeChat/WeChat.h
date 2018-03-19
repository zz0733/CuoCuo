#import <Foundation/Foundation.h>

extern NSString * wxFriendOrCircle;

@interface WeChat : NSObject

+ (void)Login;
+ (void)ShareCircle: (NSString *) info;
+ (void)ShareImage: (NSString *) info;
+ (void)ShareFriend: (NSString *) info;
+ (void)ShareScreen: (NSString *) path;
+ (NSString *)WxFriendOrCircle;

@end
