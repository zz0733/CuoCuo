(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/wahua/account/allAccountWahua.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '79ba0zdxIpFQrtrOdxbOIq9', 'allAccountWahua', __filename);
// mahjong/script/wahua/account/allAccountWahua.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        otherItemTitleColor: {
            default: cc.Color.WHITE,
            displayName: '他人明细颜色'
        },

        otherItemNumColor: {
            default: cc.Color.WHITE,
            displayName: '他人明细数字颜色'
        },

        ownItemTitleColor: {
            default: cc.Color.WHITE,
            displayName: '自己明细颜色'
        },

        ownItemNumColor: {
            default: cc.Color.WHITE,
            displayName: '自己明细数字颜色'
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
        //# sourceMappingURL=allAccountWahua.js.map
        