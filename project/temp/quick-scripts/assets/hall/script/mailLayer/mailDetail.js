(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/mailLayer/mailDetail.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f4c02W4qZxCK7gXDuRRC+Oq', 'mailDetail', __filename);
// hall/script/mailLayer/mailDetail.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel: {
            type: cc.Label,
            default: null
        },

        contentLabel: {
            type: cc.Label,
            default: null
        },

        cardImg: {
            type: cc.Sprite,
            default: null
        },

        voucherImg: {
            type: cc.Sprite,
            default: null
        },

        // hySp: {
        //     type: cc.SpriteFrame,
        //     default: null,
        // },

        // wlSp: {
        //     type: cc.SpriteFrame,
        //     default: null,
        // },

        cardNum: {
            type: cc.Label,
            default: null
        },

        okBtn: {
            type: cc.Button,
            default: null
        },

        closeBtnLabel: {
            type: cc.Label,
            default: null
        },

        closeBtn: cc.Node
    },

    init: function init(data) {
        this._data = data;
        this.timeLabel.string = data.timeStr;
        this.contentLabel.string = data.cont;
        if (data.mType === 1) {
            //无附件
            this.cardImg.node.active = false;
            this.voucherImg.node.active = false;
            this.closeBtnLabel.string = '关闭';
            this.closeBtn.active = false;
        } else {
            //有附件
            this.closeBtnLabel.string = '领取';
            this.closeBtn.active = true;
            if (data.att.opt === 3) {
                this.cardImg.node.active = false;
                this.voucherImg.node.active = true;
            } else {
                this.cardImg.node.active = true;
                this.voucherImg.node.active = false;
            }
        }
        if (data.att.data === 0) {
            this.cardNum.node.active = false;
        } else {
            this.cardNum.node.active = true;
            if (data.att.opt === 0) {//兑换券

            } else {//房卡

                }
            this.cardNum.string = data.att.data;
        }
        this.okBtn.node.once('click', this.onOkBtnClick, this);
        this.closeBtn.once('click', this.onCloseBtnClick, this);
    },
    onEnable: function onEnable() {
        this.node.getComponent(cc.Animation).play('popScaleAnim');
    },
    onOkBtnClick: function onOkBtnClick() {
        require('Audio').playEffect('hall', 'button_close.mp3');
        var animState = this.node.getComponent(cc.Animation).play('popScaleOut');
        animState.once('finished', function () {
            if (this._data.mType !== 1) {
                this._data.callback();
            }
            this.node.destroy();
        }.bind(this));
    },
    onCloseBtnClick: function onCloseBtnClick() {
        require('Audio').playEffect('hall', 'button_close.mp3');
        var animState = this.node.getComponent(cc.Animation).play('popScaleOut');
        animState.once('finished', function () {
            this.node.destroy();
        }.bind(this));
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
        //# sourceMappingURL=mailDetail.js.map
        