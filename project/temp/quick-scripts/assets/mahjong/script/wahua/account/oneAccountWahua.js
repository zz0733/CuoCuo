(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/wahua/account/oneAccountWahua.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '064baIoMAxM+qkF1YcQ0jfd', 'oneAccountWahua', __filename);
// mahjong/script/wahua/account/oneAccountWahua.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        otherNameColor: {
            default: cc.Color.WHITE,
            displayName: '其他人名字颜色'
        },

        otherNameOutLineColor: {
            default: cc.Color.WHITE,
            displayName: '其他人名字描边颜色'
        },

        ownNameColor: {
            default: cc.Color.WHITE,
            displayName: '自己名字颜色'
        },

        ownNameOutLineColor: {
            default: cc.Color.WHITE,
            displayName: '自己名字描边颜色'
        }
    },

    onLoad: function onLoad() {}
});

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
        //# sourceMappingURL=oneAccountWahua.js.map
        