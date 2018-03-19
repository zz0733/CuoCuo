(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/phone/JSPhoneWeChat.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd77ebjCLotCvpAp3NvVMGPr', 'JSPhoneWeChat', __filename);
// phone/JSPhoneWeChat.js

'use strict';

var className = 'org/cocos2dx/javascript/AppActivity';
var appUrl = 'http://download.game2me.net/';

var wechat = {
    //-- 检测微信是否存在
    WxAppIsInstalled: function WxAppIsInstalled() {
        var isInstall = true;
        if (cc.sys.os === cc.sys.OS_IOS) isInstall = jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxAppIsInstalled');
        return isInstall;
    },
    //-- 微信登录 性别 1-男, 2-女, 0-未知
    WxLogin: function WxLogin(func) {
        this._wxLoginFunc = func;
        if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod(className, 'WxLogin', '()V');else if (cc.sys.os === cc.sys.OS_IOS) jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxLogin');
    },
    //-- 微信分享给好友
    WxShareFriend: function WxShareFriend(info) {
        /*
         * 格式要求
         * let info     = {};
         * info.title   = '好友邀请-房间号: 123456';
         * info.content = '房间信息'
         * require('JSPhoneWeChat').WxShareFriend(info);
         */
        info.url = appUrl;
        if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod(className, 'WxShareFriend', '(Ljava/lang/String;)V', JSON.stringify(info));else if (cc.sys.os === cc.sys.OS_IOS) jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxShareFriend:', JSON.stringify(info));
    },
    //-- 微信分享到朋友圈
    WxShareCircle: function WxShareCircle() {
        var sharePath = 'res/raw-assets/resources/hall/texture/wx_share_circle.jpg';
        var fileData = jsb.fileUtils.getDataFromFile(sharePath);
        var newPath = jsb.fileUtils.getWritablePath() + 'wx_share_circle.jpg';
        jsb.fileUtils.writeDataToFile(fileData, newPath);

        if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod(className, 'WxShareCircle', '(Ljava/lang/String;)V', newPath);else if (cc.sys.os === cc.sys.OS_IOS) jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxShareCircle:', newPath);
    },
    //-- 微信分享截屏到好友
    WxShareFriendScreen: function WxShareFriendScreen() {
        fun.utils.screenShoot(function (filename) {
            if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod(className, 'WxShareFriendScreen', '(Ljava/lang/String;)V', filename);else if (cc.sys.os === cc.sys.OS_IOS) jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxShareFriendScreen:', filename);
        });
    },
    //-- 微信支付
    WxPay: function WxPay(info) {
        if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod(className, 'WxPay', '(Ljava/lang/String;)V', JSON.stringify(info));else if (cc.sys.os === cc.sys.OS_IOS) jsb.reflection.callStaticMethod('OCPhoneWeChat', 'WxPay:', JSON.stringify(info));
    },

    //-- 服务器返回 微信登陆 openid 和 token 登录失败返回android-true/false ios-1/0
    WxReLogin: function WxReLogin(openid, token) {
        console.log('---* js wxReLogin *---');
        console.log('openid: ' + openid);
        console.log('token:  ' + token);
        if (this._wxLoginFunc) {
            if (openid && openid !== 'false') this._wxLoginFunc({ state: true, token: token, openid: openid });else this._wxLoginFunc({ state: false });
        }
    },
    //-- 服务器返回 微信分享结果 android-true/false ios-1/0
    WxReShareResult: function WxReShareResult(result) {
        console.log('---* js WxReShareResult *---');
        console.log('result: ' + result);
        fun.event.dispatch('PhoneWeChatShareResult', result);
    },
    //-- 服务器返回 微信支付结果 android-true/false ios-1/0
    WxRePayResult: function WxRePayResult(result) {
        console.log('---* js WxRePayResult *---');
        console.log('result: ' + result);
        fun.event.dispatch('PhonePayResult', { from: 'wechat', result: result });
    }

};

module.exports = wechat;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=JSPhoneWeChat.js.map
        