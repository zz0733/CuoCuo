"use strict";
cc._RF.push(module, 'afc90G4e95IXbFJOGT1N4Ng', 'JSPhoneUmeng');
// phone/JSPhoneUmeng.js

'use strict';

var className = 'org/cocos2dx/javascript/AppActivity';
var umeng = {

    umengAnalytics: function umengAnalytics(info) {
        var strInfo = JSON.stringify(info);
        if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod(className, 'UmengSDK', '(Ljava/lang/String;)V', strInfo);else if (cc.sys.os === cc.sys.OS_IOS) jsb.reflection.callStaticMethod('NativeOcClass', 'UmengSDK:', strInfo);
    }

};

module.exports = umeng;

cc._RF.pop();