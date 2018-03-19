(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/mailLayer/mailItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bcc38K7015I0oaZKv3ZjaYi', 'mailItem', __filename);
// hall/script/mailLayer/mailItem.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        itemID: {
            default: 0,
            visible: false
        },

        timeLabel: {
            default: null,
            type: cc.Label
        },

        contentLabel: {
            default: null,
            type: cc.Label
        },

        cardNumLabel: {
            default: null,
            type: cc.Label
        },

        cardImg: {
            default: null,
            type: cc.Sprite
        },

        voucherImg: {
            default: null,
            type: cc.Sprite
        }

        // hySp: {
        //     type: cc.SpriteFrame,
        //     default: null,
        // },

        // wlSp: {
        //     type: cc.SpriteFrame,
        //     default: null,
        // },
    },

    updateItem: function updateItem(data) {
        this.lId = data.lId;
        this.mId = data.mId;
        this.timeLabel.string = data.timeStr;
        this.contentLabel.string = data.cont;
        if (data.mType === 1) {
            //无附件
            this.cardImg.node.active = false;
            this.voucherImg.node.active = false;
        } else {
            if (data.att.opt === 3) {
                this.cardImg.node.active = false;
                this.voucherImg.node.active = true;
            } else {
                this.cardImg.node.active = true;
                this.voucherImg.node.active = false;
            }
        }
        if (data.att.data === 0) {
            this.cardNumLabel.node.active = false;
        } else {
            this.cardNumLabel.node.active = true;
            this.cardNumLabel.string = data.att.data;
        }
    }
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
        //# sourceMappingURL=mailItem.js.map
        