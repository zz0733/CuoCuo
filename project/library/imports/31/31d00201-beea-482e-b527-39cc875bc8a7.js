"use strict";
cc._RF.push(module, '31d00IBvupILrUnOcyHW8in', 'publicVoiceBtn');
// hall/script/public/publicVoiceBtn.js

'use strict';

var JSPhoneVoice = require('JSPhoneVoice');

cc.Class({
    extends: cc.Component,

    properties: {
        voiceHintPre: {
            type: cc.Prefab,
            default: null
        },
        bgResN: cc.Node

    },

    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelled, this);

        this.mRect = this.node.getBoundingBox();
        var pos = cc.p(this.mRect.x, this.mRect.y);
        pos = this.node.parent.convertToWorldSpaceAR(pos);
        this.mRect.x = pos.x;
        this.mRect.y = pos.y;
        this.touching = false;

        this.userId = fun.db.getData('UserInfo').UserId;
        this.queueMgr = require("voiceQueueMgr").new();
        this.queueMgr.init();
        if (this.bgResN) {
            this.bgResN._showHide = function () {
                this.bgResN.color = new cc.Color(255, 255, 255);
            }.bind(this);
            this.bgResN._showNormal = function () {
                this.bgResN.color = new cc.Color(100, 100, 100);
            }.bind(this);
            this.bgResN._showNormal();
        }
    },
    onDestroy: function onDestroy() {
        this.queueMgr.close();
    },
    startRecord: function startRecord() {
        this._startTime = Date.now();
        this._voiceName = 'voice' + this._startTime;
        require("Audio").pauseAll();
        JSPhoneVoice.startAudio(this._voiceName);
        this.queueMgr.startRecord();
    },
    stopRecord: function stopRecord() {
        this._endTime = Date.now();
        JSPhoneVoice.stopAudio();
        this.queueMgr.endRecord();
    },
    sendRecord: function sendRecord() {

        var len = this._endTime - this._startTime;
        if (len < 1000) {
            fun.event.dispatch('MinSingleButtonPop', { contentStr: '录音时间过短,请重新录制!' });
            return;
        }
        var s = JSPhoneVoice.getVoiceDataByName(this._voiceName);
        if (!s) {
            fun.event.dispatch('MinSingleButtonPop', { contentStr: '录音失败!' });
        } else {
            fun.net.pSend('Chat', { chatType: 'voice', content: s, length: len, from: this.userId });
        }
    },
    onTouchBegan: function onTouchBegan(event) {
        if (!this.queueMgr.isCanRecord()) {
            //可给用户添加点提示
            return;
        }
        this.voiceHint = cc.instantiate(this.voiceHintPre);
        this.voiceHint.parent = cc.director.getScene().getChildByName('Canvas');
        this.voiceHintCtr = this.voiceHint.getComponent('voiceHint');
        this.voiceHintCtr.showMove();
        this.sumTime = 0;
        this.touching = true;
        this.startRecord();
    },
    onTouchMoved: function onTouchMoved(event) {
        if (!this.touching) {
            return;
        }
        var pos = event.getTouches()[0].getLocation();
        if (cc.rectContainsPoint(this.mRect, pos)) {
            this.voiceHintCtr.showMove();
        } else {
            this.voiceHintCtr.showPress();
        }
    },
    onTouchEnded: function onTouchEnded(event) {
        if (!this.touching) {
            return;
        }
        this.touching = false;
        this.voiceHint.destroy();
        this.stopRecord();
        this.sendRecord();
    },
    onTouchCancelled: function onTouchCancelled(event) {
        this.touching = false;
        this.voiceHint.destroy();
        this.stopRecord();
    },
    checkHide: function checkHide(data) {
        if (!this.bgResN) {
            return;
        }
        if (this.queueMgr.isCanRecord()) {
            this.bgResN._showNormal();
        }{
            this.bgResN._showHide();
        }
    },
    update: function update(dt) {
        this.checkHide();
        this.queueMgr.update(dt);
        if (!this.touching) {
            return;
        }

        this.sumTime += dt;
        if (!this.voiceHintCtr.setVoiceTime(this.sumTime)) {
            this.onTouchEnded();
        }
    }
});

cc._RF.pop();