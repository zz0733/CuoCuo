/*
 * 微信
 */
#import "OCPhoneWeChat.h"
#import "WeChat.h"
#import "WXApi.h"
#include "cocos2d.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

@interface OCPhoneWeChat ()
@end
@implementation OCPhoneWeChat

+ (void)WxLogin
{
    NSLog(@"---* ios OCPhoneWeChat 微信登录. *---");
    [WeChat Login];
}
+ (void)WxShareFriend: (NSString *) info
{
    NSLog(@"---* ios OCPhoneWeChat 微信分享给好友: %@", info);
    [WeChat ShareFriend:info];
}
+ (void)WxShareCircle: (NSString *) info
{
    NSLog(@"---* ios OCPhoneWeChat 微信分享到朋友圈: %@", info);
    [WeChat ShareCircle:info];
}
+ (void)WxShareFriendScreen: (NSString *) fileName
{
    NSLog(@"---* ios OCPhoneWeChat 微信分享截屏到好友: %@", fileName);
    [WeChat ShareScreen:fileName];
}

+ (void)WxReLogin: (NSString *) openid : (NSString *) token
{
    std::string wx_openid =  [openid UTF8String];
    std::string wx_token  =  [token  UTF8String];
    std::string jsCallStr = cocos2d::StringUtils::format("require('JSPhoneWeChat').WxReLogin(\"%s\", \"%s\")", wx_openid.c_str(), wx_token.c_str());
    se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
}
+ (void)WxReCancelLogin
{
    std::string jsCallStr = cocos2d::StringUtils::format("require('JSPhoneWeChat').WxRePayResult(\"%d\", \"%d\")", false, false);
    se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
}
+ (void)WxReShareResult: (bool) result
{
    std::string jsCallStr = cocos2d::StringUtils::format("require('JSPhoneWeChat').WxReShareResult(\"%d\")", result);
    se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
}

+ (bool)WxAppIsInstalled
{
    if([WXApi isWXAppInstalled]){
        return true;
    }else{
        return false;
    }
}

@end
