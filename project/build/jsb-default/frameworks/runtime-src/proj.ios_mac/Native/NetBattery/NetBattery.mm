#import "NetBattery.h"
#import "Reachability.h"
#import "OCPhoneNetBattery.h"

@interface NetBattery ()
@property (nonatomic, strong) Reachability *reachability;
@end

UIDevice *device = [UIDevice currentDevice];
@implementation NetBattery

#pragma mark phoneMoniter 手机状态监控初始话
+ (void)phoneMoniter {
    UIDevice *device = [UIDevice currentDevice];
    [device setBatteryMonitoringEnabled:YES]; //开启了监视电池状态的功能
    NetBattery *nb = [NetBattery new];
    [nb netMoniter];
    [nb batteryMoniter];
}

/* 手机电池状态 */
- (void)batteryMoniter
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(batteryStateChanged:) name:@"UIDeviceBatteryLevelDidChangeNotification" object:device];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(batteryStateChanged:) name:@"UIDeviceBatteryStateDidChangeNotification" object:device];
}
- (void)batteryStateChanged:(id)sender
{
    [self batteryStatus];
}
- (void)batteryStatus
{
    /*
     * 电池状态
     * UIDeviceBatteryStateUnknown,   // 0
     * UIDeviceBatteryStateUnplugged, // 1 on battery, discharging
     * UIDeviceBatteryStateCharging,  // 2 plugged in, less than 100%
     * UIDeviceBatteryStateFull,      // 3 plugged in, at 100%
     */
    [OCPhoneNetBattery reBatteryStatus:[device batteryState] :[device batteryLevel]*100];
}
+ (void)getBatteryStatus
{
    NetBattery *battery = [NetBattery new];
    [battery batteryStatus];
}


/* 手机网络状态 */
- (void)netMoniter
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(networkStateChanged:) name:kReachabilityChangedNotification object:nil];
    self.reachability = [Reachability reachabilityForInternetConnection];
    [self.reachability startNotifier];
}
- (void)dealloc
{
    [self.reachability stopNotifier];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [super dealloc];
}
- (void)networkStateChanged:(NSNotification *)noti
{
    Reachability *reach = [Reachability reachabilityForInternetConnection];
    NSParameterAssert([reach isKindOfClass:[Reachability class]]);
    NetworkStatus status = [reach currentReachabilityStatus];
    switch (status) {
        case NotReachable:
            [OCPhoneNetBattery reNetSatus:0 :0 :0];
            break;
        case ReachableViaWiFi:
            [self netStatus];
            break;
        case ReachableViaWWAN:
            [OCPhoneNetBattery reNetSatus:4 :0 :[self getSignalLevel]];
            break;
    }
}
+ (void)getNetStatus
{
    NetBattery *net = [NetBattery new];
    [net netStatus];
}
- (void)netStatus
{
    NetBattery *net = [NetBattery new];
    NSInteger lev = [net getSignalLevel];
    UIApplication *app = [UIApplication sharedApplication];
    NSArray *subviews = [[[app valueForKeyPath:@"statusBar"] valueForKeyPath:@"foregroundView"] subviews];
    for (id subview in subviews) {
        if ([subview isKindOfClass:NSClassFromString(@"UIStatusBarDataNetworkItemView")]) {
            int networkType = [[subview valueForKeyPath:@"dataNetworkType"] intValue];
            switch (networkType) {
                case 0:
                    [OCPhoneNetBattery reNetSatus:0 :0 :0]; //NONE
                    break;
                case 1:
                    [OCPhoneNetBattery reNetSatus:2 :0 :lev]; //2G
                    break;
                case 2:
                    [OCPhoneNetBattery reNetSatus:3 :0 :lev]; //3G
                    break;
                case 3:
                    [OCPhoneNetBattery reNetSatus:4 :0 :lev]; //4G
                    break;
                case 5:
                    [OCPhoneNetBattery reNetSatus:5 :[[subview valueForKey:@"_wifiStrengthBars"] intValue] :0];
                    break;
                default:
                    [OCPhoneNetBattery reNetSatus:0 :0 :0]; //UNKOWN
                    break;
            }
        }
    }
}

/* 获取手机信号强度 */
- (NSInteger)getSignalLevel
{
    UIApplication *app = [UIApplication sharedApplication];
    NSArray *subviews = [[[app valueForKey:@"statusBar"] valueForKey:@"foregroundView"] subviews];
    NSString *dataNetworkItemView = nil;
    for (id subview in subviews) {
        if([subview isKindOfClass:[NSClassFromString(@"UIStatusBarSignalStrengthItemView") class]]) {
            dataNetworkItemView = subview;
            break;
        }
    }
    int signalStrength = [[dataNetworkItemView valueForKey:@"signalStrengthRaw"] intValue];
    NSInteger signal = 0;
    if(signalStrength > -91){
        signal = 4;
    } else if (signalStrength <= -91 && signalStrength > -101) {
        signal = 3;
    } else if (signalStrength <= -101 && signalStrength > -110) {
        signal = 2;
    } else if (signalStrength <= -110 && signalStrength > -120) {
        signal = 1;
    } else {
        signal = 0;
    }
    return signal;
}

@end
