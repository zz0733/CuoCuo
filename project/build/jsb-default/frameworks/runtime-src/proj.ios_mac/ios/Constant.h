#ifndef Constant_h
#define Constant_h

#define RGBCOLOR(r,g,b) [UIColor colorWithRed:(r)/255.0f green:(g)/255.0f blue:(b)/255.0f alpha:1]

#define SCREEN_WIDTH [[UIScreen mainScreen] bounds].size.width
#define SCREEN_HEIGHT [[UIScreen mainScreen] bounds].size.height
#define BUFFER_SIZE 1024 * 100

static const int kHeadViewHeight = 135;
static const int kSceneViewHeight = 100;

/* 微信 */
static NSString * WECHAT_APP_ID = @"wx7224e0425e3b8655";
static NSString * WECHAT_APP_SECRET = @"67ef79a9f947aae62be073c05cd666f9";
static NSString * WECHAT_MCH_ID = @"1491203582";
static NSString * WECHAT_API_KEY = @"hejzqb1aajazfme7v2zs8e349t8f135f";
static NSString * WECHAT_PAY_TITLE = @"支付结果";
static NSString * WECHAT_PAY_SUCCESS = @"支付结果：成功！";
static NSString * WECHAT_PAY_FAILED = @"支付结果：失败！";

/* 友盟+ */
static NSString * UMENG_APP_KEY = @"599c1bda310c934fc0001b7f";
static NSString * UMENG_CHANNEL_IOS_ID = @"ScYoule_IOS";

/* 百度地图 */
static NSString * BAIDU_APP_KEY = @"HYzo7Z5y2gL6bEDT6GBYMsfV3hxXXdtG";
static NSString * APPLE_BAIDU_APP_KEY = @"09jGK1c2zHnqXkGgRspk12LTlqqb5hHw";

#endif
