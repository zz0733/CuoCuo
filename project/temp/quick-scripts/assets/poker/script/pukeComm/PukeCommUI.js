(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/script/pukeComm/PukeCommUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dbfeemSe9tJ+4EGDx0YSRAI', 'PukeCommUI', __filename);
// poker/script/pukeComm/PukeCommUI.js

'use strict';

var PukeDefine = require('PukeDefine');
var PukeData = require('PukeData');
var PukeUtils = require('PukeUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        Background: cc.Node,
        phoneStatus: cc.Node
    },

    onLoad: function onLoad() {
        PukeData.init();
        this.skinPeeler(PukeData.getSkin());
        this.scheduleTime(); //时间显示
        this.refreTimeCount = 1;
    },

    start: function start() {
        fun.event.add('PukeCommUI_PukeSkin', 'PukeSkin', this.skinPeeler.bind(this));
        fun.event.add('PukeCommUI_Battery', 'PhoneBattery', this.batteryStatus.bind(this));
        fun.event.add('PukeCommUI_Net', 'PhoneNet', this.netStatus.bind(this));
        require('JSPhoneNetBattery').getNetBatteryStatus();
    },

    update: function update(dt) {
        this.totalDtTime = (this.totalDtTime || 0) + dt;
        if (this.totalDtTime > this.refreTimeCount) {
            this.totalDtTime -= this.refreTimeCount;
            this.scheduleTime();
        }
    },

    onDestroy: function onDestroy() {
        fun.event.remove('PukeCommUI_PukeSkin');
        fun.event.remove('PukeCommUI_Battery');
        fun.event.remove('PukeCommUI_Net');
    },

    //-- 显示系统时间
    scheduleTime: function scheduleTime() {
        var date = new Date();
        this.lastMinutes = this.lastMinutes || date.getMinutes();
        var minutesStr = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var hoursStr = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var systemTime = date.getHours() + ":" + minutesStr;
        if (this.lastMinutes < date.getMinutes() && this.refreTimeCount == 1) {
            this.refreTimeCount = 30;
        }
        this.lastMinutes = date.getMinutes();
        this.phoneStatus.getChildByName("time").getComponent(cc.Label).string = systemTime;
    },

    //-- 电池状态
    batteryStatus: function batteryStatus(msg) {
        var isCharge = this.phoneStatus.getChildByName("charge");
        var progress = this.phoneStatus.getChildByName("battery");
        isCharge.active = msg.status === 0 || msg.status === 1 ? false : true;
        progress.getComponent(cc.ProgressBar).progress = msg.level / 100;
    },

    //-- 网络状态
    netStatus: function netStatus(msg) {
        var wifi = this.phoneStatus.getChildByName("wifi");
        var signal = this.phoneStatus.getChildByName("signal");
        if (msg.status === 5) {
            wifi.active = true;
            signal.active = false;
            for (var i = 1; i <= 4; ++i) {
                wifi.getChildByName('pk_wifi_' + i).active = false;
            }
            wifi.getChildByName('pk_wifi_' + msg.strength).active = true;
        } else {
            wifi.active = false;
            signal.active = true;
            for (var _i = 1; _i <= 5; ++_i) {
                signal.getChildByName('pk_signal_' + _i).active = false;
            }
            var sg = msg.signal;
            signal.getChildByName('pk_signal_' + (msg.signal + 1)).active = true;
        }
    },

    //-- 换肤
    skinPeeler: function skinPeeler(skinNum) {
        var self = this;
        PukeUtils.LoadRes(PukeDefine.BACKGROUND[skinNum - 1], "SpriteFrame", function (frame) {
            self.Background.getComponent(cc.Sprite).spriteFrame = frame;
        });
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
        //# sourceMappingURL=PukeCommUI.js.map
        