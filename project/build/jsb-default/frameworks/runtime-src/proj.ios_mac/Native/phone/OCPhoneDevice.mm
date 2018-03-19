#import "OCPhoneDevice.h"
#import "uuid.h"
#import "ApplePay.h"
#include "cocos2d.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

@interface OCPhoneDevice ()
@end
@implementation OCPhoneDevice

+ (void)ApplePay: (NSString *) info
{
    ApplePay::Pay([info UTF8String]);
}

+ (void)ReApplePayResult: (NSInteger) result : (NSString *) receipt
{
    std::string r  =  [receipt UTF8String];
    std::string jsCallStr = cocos2d::StringUtils::format("require('JSPhoneDevice').ReApplePayResult(\"%hd\", \"%s\")", (short)result, r.c_str());
    se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
}

+(NSString *)GetDeviceUUID
{
    return [UUID getDeviceUUID];
}

@end
