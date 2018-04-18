#import "WeChat.h"
#import "WXApiObject.h"
#import "WXApi.h"
#import "WXApiManager.h"
#import "JSONKit.h"
#import "ImageCompress.h"
#import "Constant.h"

NSString * wxFriendOrCircle = @"";
@implementation WeChat

+ (void)Login
{
    if([WXApi isWXAppInstalled]){
        SendAuthReq* req = [[[SendAuthReq alloc] init] autorelease];
        req.scope = @"snsapi_userinfo";
        req.state = @"123";
        [WXApi sendReq:req];
    }else{
        UIAlertView *alter = [[UIAlertView alloc] initWithTitle:@"检测到未安装微信"
                                                        message:@"请先安装微信再来登录"
                                                       delegate:nil
                                              cancelButtonTitle:@"确定"
                                              otherButtonTitles:nil];
        [alter show];
        [alter release];
    }
}

+ (void)ShareCircle: (NSString *) path
{
    NSArray *copyFilePath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask, YES);
    NSString *copyScreen = [[copyFilePath objectAtIndex:0] stringByAppendingPathComponent:[NSString stringWithFormat:@"/copyscreen.png"]];
    UIImage * luascreenimage = [UIImage imageWithContentsOfFile:path];
    NSData * imageData = UIImagePNGRepresentation(luascreenimage);
    BOOL result = [imageData writeToFile:copyScreen atomically:YES];
    NSLog(@"1.result:%@", result?@"true":@"false");
    UIImage * copyImg = [UIImage imageWithContentsOfFile:copyScreen];
    ImageCompress *ic = [[ImageCompress alloc] init];
    UIImage * newImg = [UIImage imageWithData:[ic ImageWithImage:copyImg scaledToSize:CGSizeMake(284, 160)]];
    NSData *imageDataslt = UIImagePNGRepresentation(newImg);
    BOOL resultslv = [imageDataslt writeToFile:copyScreen atomically:YES];
    NSLog(@"2.resultslv:%@", resultslv?@"true":@"false");
    
    WXMediaMessage *message = [WXMediaMessage message];
    [message setThumbImage:[UIImage imageWithContentsOfFile:copyScreen]];
    WXImageObject *ext = [WXImageObject object];
    ext.imageData = [ic zipNSDataWithImage:luascreenimage];
    message.mediaObject = ext;
    SendMessageToWXReq* req = [[[SendMessageToWXReq alloc] init] autorelease];
    req.bText = NO;
    req.message = message;
    req.scene = WXSceneTimeline;
    wxFriendOrCircle = @"wxCircle";
    [WXApi sendReq:req];
}

+ (void)ShareImage: (NSString *) info
{
//    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"wx_share_circle" ofType:@"jpg"];
//    NSData *imageData = [NSData dataWithContentsOfFile:filePath];
//    WXMediaMessage *message = [WXMediaMessage message];
//    WXImageObject *ext = [WXImageObject object];
//
//    ext.imageData = imageData;
//    message.mediaObject = ext;
//    SendMessageToWXReq* req = [[[SendMessageToWXReq alloc] init] autorelease];
//    req.bText = NO;
//    req.message = message;
//    req.scene = WXSceneTimeline;
//    wxFriendOrCircle = @"wxCircle";
//    [WXApi sendReq:req];
}

+ (void)ShareFriend: (NSString *) info
{
    WXMediaMessage *message = [[WXMediaMessage alloc] init];
    NSDictionary * dic   = [info objectFromJSONString];
    NSString * wxtitle   = [dic objectForKey:@"title"];
    NSString * wxcontent = [dic objectForKey:@"content"];
    message.title = wxtitle;
    message.description = wxcontent;
    [message setThumbImage:[UIImage imageNamed:@"Icon.png"]];
    WXWebpageObject *ext = [WXWebpageObject object];
    ext.webpageUrl = [dic objectForKey:@"url"];
    message.mediaObject = ext;
    SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
    req.bText = NO;
    req.message = message;
    req.scene = WXSceneSession;
    wxFriendOrCircle = @"wxFriend";
    [WXApi sendReq:req];
}

+ (NSString *)WxFriendOrCircle
{
    return wxFriendOrCircle;
}

+ (void)ShareScreen: (NSString *) path
{
    NSArray *copyFilePath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask, YES);
    NSString *copyScreen = [[copyFilePath objectAtIndex:0] stringByAppendingPathComponent:[NSString stringWithFormat:@"/copyscreen.png"]];
    UIImage * luascreenimage = [UIImage imageWithContentsOfFile:path];
    NSData * imageData = UIImagePNGRepresentation(luascreenimage);
    BOOL result = [imageData writeToFile:copyScreen atomically:YES];
    NSLog(@"1.result:%@", result?@"true":@"false");
    UIImage * copyImg = [UIImage imageWithContentsOfFile:copyScreen];
    ImageCompress *ic = [[ImageCompress alloc] init];
    UIImage * newImg = [UIImage imageWithData:[ic ImageWithImage:copyImg scaledToSize:CGSizeMake(284, 160)]];
    NSData *imageDataslt = UIImagePNGRepresentation(newImg);
    BOOL resultslv = [imageDataslt writeToFile:copyScreen atomically:YES];
    NSLog(@"2.resultslv:%@", resultslv?@"true":@"false");
    
    WXMediaMessage *message = [WXMediaMessage message];
    [message setThumbImage:[UIImage imageWithContentsOfFile:copyScreen]];
    WXImageObject *imageObject = [WXImageObject object];
    imageObject.imageData = [ic zipNSDataWithImage:luascreenimage];
    message.mediaObject = imageObject;
    SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
    req.bText = NO;
    req.message = message;
    req.scene = WXSceneSession;
    [WXApi sendReq:req];
}
@end
