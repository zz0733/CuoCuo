"use strict";
cc._RF.push(module, '79ba0zdxIpFQrtrOdxbOIq9', 'allAccountWahua');
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