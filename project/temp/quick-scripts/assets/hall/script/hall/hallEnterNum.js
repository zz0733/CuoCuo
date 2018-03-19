(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/hall/hallEnterNum.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7a36eokTsxGx4A3hUSbXt9A', 'hallEnterNum', __filename);
// hall/script/hall/hallEnterNum.js

'use strict';

var GameCfg = require('GameCfg');
var Audio = require('Audio');
var PanelType = cc.Enum({
    enterRoom: 0,
    viewPlayback: 1
});

cc.Class({
    extends: cc.Component,

    properties: {
        panelType: {
            type: PanelType,
            default: PanelType.enterRoom
        }
    },

    onLoad: function onLoad() {
        var bg = this.node.getChildByName('back');
        this.targetNum = [];
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        bg.getChildByName('btnClean').on('click', this.onBtnCleanClick, this);
        bg.getChildByName('btnReenter').on('click', this.onBtnReenterClick, this);
        var enterNumber = bg.getChildByName('enterNumber');
        this.maxNum = enterNumber.childrenCount;
        this.numberEnter = [];
        for (var i = 0; i < this.maxNum; i++) {
            this.numberEnter[i] = enterNumber.getChildByName("num_" + (i + 1)).getChildByName('content');
            this.numberEnter[i].active = false;
        }
        var numBtns = bg.getChildByName('numBtns');
        for (var _i = 0; _i < 10; _i++) {
            numBtns.getChildByName("btnNum" + _i).on('click', this.onNumBtnClick.bind(this, _i));
        }

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', this.onAnimationFinished, this);
    },
    onAnimationFinished: function onAnimationFinished() {
        if (this.panelType === PanelType.viewPlayback) {
            this.node.destroy();
        } else {
            this.targetNum = [];
            this.numberEnter.forEach(function (v) {
                v.active = false;
            });
            this.node.active = false;
        }
    },
    onBtnCleanClick: function onBtnCleanClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        if (this.targetNum.length <= 0) {
            return;
        }
        this.targetNum.pop();
        this.numberEnter[this.targetNum.length].active = false;
    },
    onBtnReenterClick: function onBtnReenterClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.targetNum = [];
        this.numberEnter.forEach(function (v) {
            v.active = false;
        });
    },
    getRoomIdByArray: function getRoomIdByArray(arr) {
        var roomid = '';
        arr.forEach(function (num) {
            roomid += num;
        });
        return parseInt(roomid);
    },
    onNumBtnClick: function onNumBtnClick(num) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        if (this.targetNum.length >= this.maxNum) {
            return;
        }
        this.numberEnter[this.targetNum.length].getComponent(cc.Label).string = num;
        this.numberEnter[this.targetNum.length].active = true;
        this.targetNum.push(num);
        if (this.targetNum.length < this.maxNum) {
            return;
        }
        var rId = this.getRoomIdByArray(this.targetNum);
        if (this.panelType === PanelType.viewPlayback) {
            fun.event.dispatch('Zhuanquan', { flag: true, text: '回放加载中，请稍后...' });
            fun.net.pSend('ReplayRecordByCode', { Code: rId }, function (data) {
                if (data.RetCode && data.RetCode !== 0) {
                    fun.event.dispatch('Zhuanquan', { flag: false });
                    return;
                }
                fun.db.setData('ReplayInfo', data);
            });
        } else if (this.panelType === PanelType.enterRoom) {
            fun.db.setData('EnterRoomId', rId);
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
        //# sourceMappingURL=hallEnterNum.js.map
        