#import <Foundation/Foundation.h>

@interface OCPhoneAudio : NSObject

+ (void)startAudio: (NSString *) path;

+ (void)stopAudio;

+ (void)playAudio: (NSString *) path;

@end
