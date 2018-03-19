#import "BaiDu.h"
#import "OCPhoneBaiDu.h"

@interface BaiDu()
@property(nonatomic, strong) BMKLocationManager *locationManager;
@property(nonatomic, copy) BMKLocatingCompletionBlock completionBlock;
@end

@implementation BaiDu

-(void)initLocation
{
    _locationManager = [[BMKLocationManager alloc] init];
    _locationManager.delegate = self;
    _locationManager.coordinateType = BMKLocationCoordinateTypeBMK09LL;
    _locationManager.distanceFilter = kCLDistanceFilterNone;
    _locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    _locationManager.activityType = CLActivityTypeAutomotiveNavigation;
    _locationManager.pausesLocationUpdatesAutomatically = NO;
//    _locationManager.allowsBackgroundLocationUpdates = YES;
    _locationManager.locationTimeout = 10;
    _locationManager.reGeocodeTimeout = 10;
}
-(void)initBlock
{
    self.completionBlock = ^(BMKLocation *location, BMKLocationNetworkState state, NSError *error)
    {
        if (error) {
            NSLog(@"---* locError:{%ld - %@};", (long)error.code, error.localizedDescription);
        }
        NSString *latitude = @"0";
        NSString *longitude = @"0";
        NSString *locationStr = @"";
        if (location.location) {
            latitude = [NSString stringWithFormat: @"%f", location.location.coordinate.latitude];
            longitude = [NSString stringWithFormat: @"%f", location.location.coordinate.longitude];
        }
        if (location.rgcData) {
            NSArray *arr = [NSArray arrayWithObjects:location.rgcData.country, location.rgcData.province, location.rgcData.city, location.rgcData.district, location.rgcData.street, location.rgcData.locationDescribe, nil];
            for (int i=0; i<arr.count; i++) {
                if (arr[i] != nil) {
                    locationStr = [locationStr stringByAppendingString: arr[i]];
                }
            }
        }
        NSDictionary *dict = @{@"lat": latitude, @"lon": longitude, @"locdesc": locationStr};
        NSError *err = nil;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:&err];
        NSString *jsonStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        [OCPhoneBaiDu reBaiDuLocation:jsonStr];
    };
    [_locationManager requestLocationWithReGeocode:YES withNetworkState:YES completionBlock:self.completionBlock];
}

+ (void)getLocation
{
    BaiDu * bd = [BaiDu new];
    [bd initLocation];
    [bd initBlock];
}

- (void)dealloc {
    [super dealloc];
    _locationManager = nil;
    _completionBlock = nil;
}

@end
