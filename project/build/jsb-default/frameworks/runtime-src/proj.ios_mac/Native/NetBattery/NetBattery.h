/*
 * 获取电池状态及网络状态 获取手机状态
 */
#import <Foundation/Foundation.h>

@interface NetBattery : NSObject

+ (void)phoneMoniter;

+ (void)getBatteryStatus;
+ (void)getNetStatus;

@end
