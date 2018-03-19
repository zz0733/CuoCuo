#import <Foundation/Foundation.h>

@interface Audio : NSObject

+ (void)startAudio: (NSString *) path;

+ (void)stopAudio;

+ (void)playAudio: (NSString *) path;

+ (NSInteger)getVoiceLength;

- (void)NSAudio;

- (void)RecordInit;

- (void)transformCAFToMP3:(NSURL *)transform
       transformCAFToMP3T:(NSURL *)mp3filepath;

@end
