#import <Foundation/Foundation.h>

@interface OCPhoneNetBattery : NSObject

+ (void)getNetBatteryStatus;

+ (void)reBatteryStatus: (NSInteger) status : (NSInteger) level;
+ (void)reNetSatus: (NSInteger) status : (NSInteger) strength : (NSInteger) signal;

@end
