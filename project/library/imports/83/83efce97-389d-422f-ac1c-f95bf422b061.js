"use strict";
cc._RF.push(module, '83efc6XOJ1CL6wc+Vv0IrBh', 'whPaiTouch');
// mahjong/script/wahua/prefab/whPaiTouch.js

'use strict';

var WhDefine = require('whDefine');
var WhUtils = require('whUtils');

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this.originalPos = this.node.getPosition();
        this.touchOn();
    },
    onDestroy: function onDestroy() {
        this.touchOff();
    },
    touchOn: function touchOn() {
        this.node.on('click', this.onPaiClick, this);
        this.node.on('touchmove', this.moveTouchFunc, this);
        this.node.on('touchend', this.endCancelTouchFunc, this);
        this.node.on('touchcancel', this.endCancelTouchFunc, this);
    },
    touchOff: function touchOff() {
        this.node.off('click', this.onPaiClick, this);
        this.node.off('touchmove', this.moveTouchFunc, this);
        this.node.off('touchend', this.endCancelTouchFunc, this);
        this.node.off('touchcancel', this.endCancelTouchFunc, this);
    },
    setCardNumber: function setCardNumber(card) {
        this.cardInfo = { cardNumber: card, xiaCP: true };
    },
    checkDoubleClick: function checkDoubleClick() {
        var nowTime = new Date().getTime();
        if (this._clickTime) {
            if (nowTime - this._clickTime < WhDefine.DoubleClickTime * 1000) {
                this._clickTime = nowTime;
                return true;
            } else {
                this._clickTime = nowTime;
                return false;
            }
        } else {
            this._clickTime = nowTime;
            return false;
        }
    },
    onPaiClick: function onPaiClick() {
        if (this.checkDoubleClick()) {
            this.node.parent.parent.parent.getComponent('playerUiWahua').chuPai(this.cardInfo, true);
            this.node.active = false;
        }
        // else {
        // if (this._isMove) return;
        // this._isMove = false;
        // this._paiShouldOut = !this._paiShouldOut;
        // this.node.parent.parent.parent.getComponent('playerUiWahua').xiaPaiAllDown();
        // this.node.setPositionY(this.originalPos.y + (this._paiShouldOut ? 20 : 0));
        // }
    },
    moveTouchFunc: function moveTouchFunc(event) {
        this._isMove = true;
        this.node.parent.parent.parent.getComponent('playerUiWahua').setXianVisible(true);
        if (cc.sys.isNative) {
            this.node.setPosition(event.touch.getDelta());
        } else {
            this.node.setPosition(cc.p(event.getLocation().x - 120, event.getLocation().y - 220));
        }
    },
    endCancelTouchFunc: function endCancelTouchFunc(event) {
        this.node.parent.parent.parent.getComponent('playerUiWahua').setXianVisible(false);
        if (this.node.getPositionY() < WhDefine.PlayCardHeight) {
            this.node.setPosition(this.originalPos);
        } else {
            this.node.parent.parent.parent.getComponent('playerUiWahua').chuPai(this.cardInfo, true);
            this.node.active = false;
        }
    }
});

cc._RF.pop();