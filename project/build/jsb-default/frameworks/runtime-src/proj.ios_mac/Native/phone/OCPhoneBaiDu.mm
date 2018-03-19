/*
 * 百度地图定位
 */
#import "OCPhoneBaiDu.h"
#import "BaiDu.h"
#include "cocos2d.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#import "JSONKit.h"

@interface OCPhoneBaiDu ()
@end
@implementation OCPhoneBaiDu

+ (void)getBaiDuLocation
{
    [BaiDu getLocation];
}
+ (void)reBaiDuLocation: (NSString *) reLocation
{
    NSDictionary *dict = [reLocation objectFromJSONString];
    std::string lat = [[dict objectForKey:@"lat"] UTF8String];
    std::string lon = [[dict objectForKey:@"lon"] UTF8String];
    std::string locdesc = [[dict objectForKey:@"locdesc"] UTF8String];
    std::string jsCallStr = cocos2d::StringUtils::format("require('JSPhoneBaiDu').reBaiDuLocation(\"%s\", \"%s\", \"%s\")", lat.c_str(), lon.c_str(), locdesc.c_str());
    se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
}

@end
