(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Common/DDZ_OSDate.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3190e6zwq5L0pP8vTFwZUIs', 'DDZ_OSDate', __filename);
// poker/DDZ/Script/Common/DDZ_OSDate.js

"use strict";

var OSDate = cc.Class({});

OSDate.LocalTimeString = function () {
    //	根据本地时间格式，把 Date 对象转换为字符串。
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var second = date.getSeconds();
    var min = date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    if (min >= 0 && min <= 9) {
        min = "0" + min;
    }
    if (second >= 0 && second <= 9) {
        second = "0" + second;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + hour + seperator2 + min + seperator2 + second;
    return currentdate;
};
OSDate.showTime = function () {
    var date = new Date();
    var seperator2 = ":";
    var hour = date.getHours();
    var min = date.getMinutes();

    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    if (min >= 0 && min <= 9) {
        min = "0" + min;
    }
    var currentdate = hour + seperator2 + min;
    return currentdate;
};
cc.YL.DDZ_Osdate = OSDate;
module.exports = OSDate;

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
        //# sourceMappingURL=DDZ_OSDate.js.map
        