const className = 'org/cocos2dx/javascript/AppActivity';
const appUrl = 'http://download.game2me.net/';

let wechat = {
    //-- 检测微信是否存在
    WxAppIsInstalled : function(){
        let isInstall = true;
        if(cc.sys.os === cc.sys.OS_IOS)
            isInstall = jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxAppIsInstalled');
        return isInstall;
    },
    //-- 微信登录 性别 1-男, 2-女, 0-未知
    WxLogin : function(func){
        this._wxLoginFunc = func;
        if(cc.sys.os === cc.sys.OS_ANDROID)
            jsb.reflection.callStaticMethod(className, 'WxLogin', '()V');
        else if(cc.sys.os === cc.sys.OS_IOS)
            jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxLogin');
    },
    //-- 微信分享给好友
    WxShareFriend : function(info){
        /*
         * 格式要求
         * let info     = {};
         * info.title   = '好友邀请-房间号: 123456';
         * info.content = '房间信息'
         * require('JSPhoneWeChat').WxShareFriend(info);
         */
        info.url = appUrl;
        if(cc.sys.os === cc.sys.OS_ANDROID)
            jsb.reflection.callStaticMethod(className, 'WxShareFriend', '(Ljava/lang/String;)V', JSON.stringify(info));
        else if (cc.sys.os === cc.sys.OS_IOS)
            jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxShareFriend:', JSON.stringify(info));
    },
    //-- 微信分享到朋友圈
    WxShareCircle : function(){
        let sharePath = 'res/raw-assets/resources/hall/texture/wx_share_circle.jpg';
        let fileData = jsb.fileUtils.getDataFromFile(sharePath);
        let newPath   = jsb.fileUtils.getWritablePath() + 'wx_share_circle.jpg';
        jsb.fileUtils.writeDataToFile(fileData, newPath);

        if(cc.sys.os === cc.sys.OS_ANDROID)
            jsb.reflection.callStaticMethod(className, 'WxShareCircle', '(Ljava/lang/String;)V', newPath);
        else if (cc.sys.os === cc.sys.OS_IOS)
            jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxShareCircle:', newPath);
    },
    //-- 微信分享截屏到好友
    WxShareFriendScreen : function(){
        fun.utils.screenShoot(function(filename){
            if(cc.sys.os === cc.sys.OS_ANDROID)
                jsb.reflection.callStaticMethod(className, 'WxShareFriendScreen', '(Ljava/lang/String;)V', filename);
            else if (cc.sys.os === cc.sys.OS_IOS)
                jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxShareFriendScreen:', filename);
        });
    },
    //-- 微信支付
    WxPay : function(info){
        if(cc.sys.os === cc.sys.OS_ANDROID)
            jsb.reflection.callStaticMethod(className, 'WxPay', '(Ljava/lang/String;)V', JSON.stringify(info));
        else if (cc.sys.os === cc.sys.OS_IOS)
            jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxPay:', JSON.stringify(info));
    },

    //-- 服务器返回 微信登陆 openid 和 token 登录失败返回android-true/false ios-1/0
    WxReLogin : function(openid, token){
        console.log('---* js wxReLogin *---');
        console.log('openid: ' + openid);
        console.log('token:  ' + token);
        if(this._wxLoginFunc) {
            if (openid && openid !== 'false')
                this._wxLoginFunc({state: true, token: token, openid: openid});
            else
                this._wxLoginFunc({state: false});
        }
    },
    //-- 服务器返回 微信分享结果 android-true/false ios-1/0
    WxReShareResult : function(result){
        console.log('---* js WxReShareResult *---');
        console.log('result: ' + result);
        fun.event.dispatch('PhoneWeChatShareResult', result === '0' ? false : result);
    },
    //-- 服务器返回 微信支付结果 android-true/false ios-1/0
    WxRePayResult : function(result){
        console.log('---* js WxRePayResult *---');
        console.log('result: ' + result);
        fun.event.dispatch('PhonePayResult', {from: 'wechat', result: result});
    },

};

module.exports = wechat;