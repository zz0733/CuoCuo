(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/phone/JSPhoneDevice.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '44cc5w0FeZAOLLWkPaoB4+I', 'JSPhoneDevice', __filename);
// phone/JSPhoneDevice.js

'use strict';

var className = 'org/cocos2dx/javascript/AppActivity';
var ApplePayPrice = [6, 18, 50, 128, 298, 618];

var device = {
    getDeviceUUID: function getDeviceUUID() {
        var uuid = void 0;
        if (cc.sys.os === cc.sys.OS_ANDROID) uuid = jsb.reflection.callStaticMethod(className, 'getDeviceUUID', '()Ljava/lang/String;');else if (cc.sys.os === cc.sys.OS_IOS) uuid = jsb.reflection.callStaticMethod('OCPhoneDevice', 'getDeviceUUID');
        console.log('---* js getDeviceUUID *---');
        console.log(uuid);
    },
    ApplePay: function ApplePay(strId) {
        if (cc.sys.os !== cc.sys.OS_IOS) return;
        jsb.reflection.callStaticMethod('OCPhoneDevice', 'ApplePay:', strId);
    },
    ReApplePayResult: function ReApplePayResult(result, receipt) {
        console.log('---* js ReApplePayResult *---');
        console.log('result:  ' + result);
        console.log('receipt: ' + receipt);
        if (receipt !== '') {
            var applePayStr = JSON.stringify({ check: true, receipt: receipt });
            cc.sys.localStorage.setItem('applePayReceiptStr', applePayStr);
        }
        fun.event.dispatch('PhonePayResult', { from: 'apple', result: result, receipt: receipt });
    }
};

module.exports = device;

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
        //# sourceMappingURL=JSPhoneDevice.js.map
        