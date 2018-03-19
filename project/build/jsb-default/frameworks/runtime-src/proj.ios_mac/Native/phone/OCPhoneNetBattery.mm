/*
 * 网络状态/电池状态
 */
#import "OCPhoneNetBattery.h"
#import "NetBattery.h"
#include "cocos2d.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

@interface OCPhoneNetBattery ()
@end
@implementation OCPhoneNetBattery

+ (void)getNetBatteryStatus
{
    [NetBattery getBatteryStatus];
    [NetBattery getNetStatus];
}

+ (void)reBatteryStatus: (NSInteger) status : (NSInteger) level
{
    std::string jsCallStr = cocos2d::StringUtils::format("require('JSPhoneNetBattery').reBattery(\"%hd\", \"%hd\")", (short)status, (short)level);
    se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
}

+ (void)reNetSatus: (NSInteger) status : (NSInteger) strength : (NSInteger) signal
{
    std::string jsCallStr = cocos2d::StringUtils::format("require('JSPhoneNetBattery').reNet(\"%hd\", \"%hd\", \"%hd\")", (short)status, (short)strength, (short)signal);
    se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
}

@end
