(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/public/voiceQueueMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '452d3quYwZGZZry6b5WqHmA', 'voiceQueueMgr', __filename);
// hall/script/public/voiceQueueMgr.js

"use strict";

/*
    此队列机制是因为目前项目引用的录音工具库有bug，在此前的黄岩麻将上国良哥决定的这套机制
    1、语音一条一条的播放
    2、正在播放语音不录音
    3、正在录音不播放语音
*/

var QueueMgr = function QueueMgr() {
    this.voiceList = [];
    this.playVoiceTime = -1;
    this.isRecord = false;
    this.init = function (voiceBtn) {
        fun.event.add("publicVoice", "RoomChat", this.playerVoiceChat.bind(this));
    };
    this.close = function () {
        fun.event.remove("publicVoice", "RoomChat", this.playerVoiceChat.bind(this));
    };
    this.update = function (dt) {
        if (this.playVoiceTime != -1) {
            this.playVoiceTime -= dt;
            if (this.playVoiceTime < 0) {
                this.playVoiceTime = -1;
                this.nextVoice();
            }
        }
    };

    this.playerVoiceChat = function (data) {
        if (data.chatType != "voice") {
            return;
        }
        //浏览器不播放语音
        if (!cc.sys.isNative) {
            return;
        }
        this.voiceList.push(data);
        this.nextVoice();
    };

    this.nextVoice = function () {
        if (this.voiceList.length < 1) {
            this.voiceEnd();
            return;
        }
        //正在播放语音，暂时不播放，一条一条的播放
        if (this.playVoiceTime != -1) {
            return;
        }
        //因为边播放语音边录音这个三方工具包有录音没有声音的bug
        //所以正在录音, 不播放。
        if (this.isRecord) {
            return;
        }

        var voiceData = this.voiceList.shift();
        voiceData.length = voiceData.length / 1000;
        this.playVoiceTime = voiceData.length;

        fun.event.dispatch('RoomChatVoice', voiceData);
        var PhoneVoice = require("JSPhoneVoice");
        require("Audio").pauseAll();
        PhoneVoice.playAudio(voiceData.content);
    };

    this.voiceEnd = function () {
        require("Audio").resumeAll();
    };

    this.startRecord = function () {
        this.isRecord = true;
    };

    this.endRecord = function () {
        this.isRecord = false;
        this.nextVoice();
    };

    this.isCanRecord = function () {
        return this.playVoiceTime == -1;
    };
};

module.exports = {
    new: function _new() {
        return new QueueMgr();
    }
};

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
        //# sourceMappingURL=voiceQueueMgr.js.map
        