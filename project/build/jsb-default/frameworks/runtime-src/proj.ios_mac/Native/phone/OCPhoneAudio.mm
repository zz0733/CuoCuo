/*
 * 语音聊天
 */
#import "OCPhoneAudio.h"
#import "Audio.h"
#include "cocos2d.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

@interface OCPhoneAudio ()
@end
@implementation OCPhoneAudio

+ (void)startAudio: (NSString *) path
{
    [Audio startAudio:path];
}

+ (void)stopAudio
{
    [Audio stopAudio];
}

+ (void)playAudio: (NSString *) path
{
    [Audio playAudio:path];
}

@end
