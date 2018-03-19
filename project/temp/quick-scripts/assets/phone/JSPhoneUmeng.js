(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/phone/JSPhoneUmeng.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'afc90G4e95IXbFJOGT1N4Ng', 'JSPhoneUmeng', __filename);
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
        //# sourceMappingURL=JSPhoneUmeng.js.map
        