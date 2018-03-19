#import "WXApiManager.h"
#import "WeChat.h"
#import "OCPhoneWeChat.h"
#import "Constant.h"
#import "ASIHTTPRequest.h"
#import "JSONKit.h"

@implementation WXApiManager

#pragma mark - LifeCycle
+(instancetype)sharedManager {
    static dispatch_once_t onceToken;
    static WXApiManager *instance;
    dispatch_once(&onceToken, ^{
        instance = [[WXApiManager alloc] init];
    });
    return instance;
}

#pragma mark - WXApiDelegate
- (void)onResp:(BaseResp *)resp {
    if ([resp isKindOfClass:[SendMessageToWXResp class]]) {
        SendMessageToWXResp *messageResp = (SendMessageToWXResp *)resp;
        NSLog(@"ERROR CODE : %d", messageResp.errCode);
        if ([[WeChat WxFriendOrCircle]  isEqual: @"wxCircle"]) {
            if (messageResp.errCode == WXSuccess) {
                [OCPhoneWeChat WxReShareResult:true];
            } else {
                [OCPhoneWeChat WxReShareResult:false];
            }
        }
    } else if ([resp isKindOfClass:[SendAuthResp class]]) {
        SendAuthResp *authResp = (SendAuthResp *)resp;
        if (authResp.errCode == WXSuccess) {
            NSString * grantStr  = @"grant_type=authorization_code";
            NSString * tokenUrl  = @"https://api.weixin.qq.com/sns/oauth2/access_token?";
            NSString * strurl = [NSString stringWithFormat:@"%@appid=%@&secret=%@&code=%@&%@", tokenUrl, WECHAT_APP_ID, WECHAT_APP_SECRET, authResp.code, grantStr];
            NSURL *nsurl = [NSURL URLWithString:strurl];
            NSLog(@"--- nsurl : %@", nsurl);
            ASIHTTPRequest * request = [[ASIHTTPRequest alloc]initWithURL:nsurl];
            [request setDefaultResponseEncoding:NSUTF8StringEncoding];
            [request setRequestMethod:@"GET"];
            [request startSynchronous];
            NSString     * str   = request.responseString;
            NSDictionary * dic   = [str objectFromJSONString];
            NSString * wx_token  = [dic objectForKey:@"access_token"];
            NSString * wx_openid = [dic objectForKey:@"openid"];
            NSLog(@"----- wx_openid : %@", wx_openid);
            NSLog(@"----- wx_token  : %@", wx_token );
            [OCPhoneWeChat WxReLogin:wx_openid :wx_token];
        } else {
            [OCPhoneWeChat WxReCancelLogin];
        }
    } else if ([resp isKindOfClass:[AddCardToWXCardPackageResp class]]) {
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvAddCardResponse:)]) {
            AddCardToWXCardPackageResp *addCardResp = (AddCardToWXCardPackageResp *)resp;
            [_delegate managerDidRecvAddCardResponse:addCardResp];
        }
    } else if ([resp isKindOfClass:[WXChooseCardResp class]]) {
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvChooseCardResponse:)]) {
            WXChooseCardResp *chooseCardResp = (WXChooseCardResp *)resp;
            [_delegate managerDidRecvChooseCardResponse:chooseCardResp];
        }
    }else if ([resp isKindOfClass:[WXChooseInvoiceResp class]]){
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvChooseInvoiceResponse:)]) {
            WXChooseInvoiceResp *chooseInvoiceResp = (WXChooseInvoiceResp *)resp;
            [_delegate managerDidRecvChooseInvoiceResponse:chooseInvoiceResp];
        }
    }else if ([resp isKindOfClass:[WXSubscribeMsgResp class]]){
        if ([_delegate respondsToSelector:@selector(managerDidRecvSubscribeMsgResponse:)])
        {
            [_delegate managerDidRecvSubscribeMsgResponse:(WXSubscribeMsgResp *)resp];
        }
    }else if ([resp isKindOfClass:[WXLaunchMiniProgramResp class]]){
        if ([_delegate respondsToSelector:@selector(managerDidRecvLaunchMiniProgram:)]) {
            [_delegate managerDidRecvLaunchMiniProgram:(WXLaunchMiniProgramResp *)resp];
        }
    }
}

- (void)onReq:(BaseReq *)req {
    if ([req isKindOfClass:[GetMessageFromWXReq class]]) {
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvGetMessageReq:)]) {
            GetMessageFromWXReq *getMessageReq = (GetMessageFromWXReq *)req;
            [_delegate managerDidRecvGetMessageReq:getMessageReq];
        }
    } else if ([req isKindOfClass:[ShowMessageFromWXReq class]]) {
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvShowMessageReq:)]) {
            ShowMessageFromWXReq *showMessageReq = (ShowMessageFromWXReq *)req;
            [_delegate managerDidRecvShowMessageReq:showMessageReq];
        }
    } else if ([req isKindOfClass:[LaunchFromWXReq class]]) {
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvLaunchFromWXReq:)]) {
            LaunchFromWXReq *launchReq = (LaunchFromWXReq *)req;
            [_delegate managerDidRecvLaunchFromWXReq:launchReq];
        }
    }
}

@end
