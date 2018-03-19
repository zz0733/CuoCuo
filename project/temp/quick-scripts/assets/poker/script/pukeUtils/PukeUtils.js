(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/script/pukeUtils/PukeUtils.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '50dc4/BiFFISJyUGo6iYF08', 'PukeUtils', __filename);
// poker/script/pukeUtils/PukeUtils.js

"use strict";

var SanGongCfg = require("SanGongCfg");
var NiuNiuCfg = require("NiuNiuCfg");
var loadedRes = {}; //缓存加载了的icon

var PukeUtils = {
    pSub: function pSub(pt1, pt2) {
        return { x: pt1.x - pt2.x, y: pt1.y - pt2.y };
    },

    pGetLength: function pGetLength(pt) {
        return Math.sqrt(Math.pow(pt.x, 2) + Math.pow(pt.y, 2));
    },

    // 求两点之间的距离
    pGetDistance: function pGetDistance(startP, endP) {
        return this.pGetLength(this.pSub(startP, endP));
    },

    //--- 加载图片和Spine动画
    LoadRes: function LoadRes(filepath, name, callback) {
        if (name === "SpriteFrame") {
            cc.loader.loadRes(filepath, cc.SpriteFrame, function (err, frame) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                callback(frame);
            });
        } else if (name === "sp.SkeletonData") {
            cc.loader.loadRes(filepath, sp.SkeletonData, function (err, res) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                callback(res);
            });
        }
    },

    //--- 自定义按钮 Touch 放大缩小
    buttonTouch: function buttonTouch(button, scale, initScale, func) {
        var scaleDownAction = cc.scaleTo(0.1, scale);
        var scaleUpAction = cc.scaleTo(0.1, initScale);
        var touch = button.getChildByName("touch");
        touch.on('touchstart', function () {
            button.stopAllActions();
            button.runAction(scaleDownAction);
        });
        touch.on('touchend', function () {
            button.stopAllActions();
            button.runAction(cc.sequence(scaleUpAction, cc.callFunc(function () {
                func();
            })));
        });
        touch.on('touchcancel', function () {
            button.stopAllActions();
            button.runAction(scaleUpAction);
        });
    },

    // 判断手机是否合法
    VerificationPhoneCode: function VerificationPhoneCode(phoneNumber) {
        if (phoneNumber.length === 0) {
            return "NO_NUMBER";
        }
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (phoneNumber.length === 11 && myreg.test(phoneNumber)) {
            return "SUCCESS";
        } else {
            return "FAILED";
        }
    },

    // JS 获取 Map 长度, 加上一个 hasOwnProperty 判断过滤下原型中的属性就比较安全了
    getLength: function getLength(obj) {
        var count = 0;
        for (var value in obj) {
            if (obj.hasOwnProperty(value)) {
                count++;
            }
        }
        return count;
    }
};

module.exports = PukeUtils;

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
        //# sourceMappingURL=PukeUtils.js.map
        