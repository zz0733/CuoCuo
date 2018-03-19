"use strict";
cc._RF.push(module, '8e5a6xVkFhBc7i8H6sAPw6Y', 'hallRenzheng');
// hall/script/hall/hallRenzheng.js

'use strict';

var Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var bg = this.node.getChildByName('back');
        this.nameLayer = bg.getChildByName('name');
        this.nameLayer.active = false;
        this.nameLayer.getChildByName('btnPhone').on('click', this.onBtnPhoneClick, this);

        this.phoneLayer = bg.getChildByName('phone');
        this.phoneLayer.active = true;
        this.phoneLayer.getChildByName('btnName').on('click', this.onBtnNameClick, this);
        this.btnObtain = this.phoneLayer.getChildByName('btnObtain');
        this.btnObtain.on('click', this.onBtnObtainClick, this);
        this.phoneBox = this.phoneLayer.getChildByName('inputBoxPhone').getComponent(cc.EditBox);
        this.codeBox = this.phoneLayer.getChildByName('inputBoxCode').getComponent(cc.EditBox);
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },
    onDestroy: function onDestroy() {
        this.unscheduleAllCallbacks();
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    onBtnNameClick: function onBtnNameClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.nameLayer.active = true;
        this.phoneLayer.active = false;
    },
    onBtnPhoneClick: function onBtnPhoneClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.nameLayer.active = false;
        this.phoneLayer.active = true;
    },
    onBtnObtainClick: function onBtnObtainClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        if (this.phoneBox.length !== 11) {
            return;
        }
        this.btnObtain.interactable = false;
        this.scheduleOnce(this._BtnObtainCb.bind(this), 60 * 1000);
    },
    _BtnObtainCb: function _BtnObtainCb() {
        this.btnObtain.interactable = true;
    },
    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    }
});

cc._RF.pop();