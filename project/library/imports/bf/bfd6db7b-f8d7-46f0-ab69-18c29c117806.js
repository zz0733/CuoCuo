"use strict";
cc._RF.push(module, 'bfd6dt7+NdG8KtpGMKcEXgG', 'phoneStatusWahua');
// mahjong/script/wahua/desk/phoneStatusWahua.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        wifiNode: {
            type: cc.Node,
            default: null
        },

        signalNode: {
            type: cc.Node,
            default: null
        },

        isChargerNode: {
            type: cc.Node,
            default: null
        },

        batteryProgress: {
            type: cc.ProgressBar,
            default: null
        },

        timeLabel: {
            type: cc.Label,
            default: null
        }
    },

    onLoad: function onLoad() {
        fun.event.add('PhoneNetPhoneStatusWahua', 'PhoneNet', this.onPhoneNetEvent.bind(this));
        fun.event.add('PhoneBatteryPhoneStatusWahua', 'PhoneBattery', this.onPhoneBatteryEvent.bind(this));
        require("JSPhoneNetBattery").getNetBatteryStatus();
        this._sumdt = 0;
        this._currTime = Date.now();
        this.formatTime();
    },
    onDestroy: function onDestroy() {
        fun.event.remove('PhoneNetPhoneStatusWahua');
        fun.event.remove('PhoneBatteryPhoneStatusWahua');
    },
    update: function update(dt) {
        this._sumdt += dt;
        if (this._sumdt < 1) {
            return;
        }
        this._sumdt -= 1;
        this._currTime += 1000;
        this.formatTime();
    },
    onPhoneNetEvent: function onPhoneNetEvent(data) {
        if (data.status === 5) {
            this.wifiNode.active = true;
            this.signalNode.active = false;;
            this.setWifiStrength(data.strength);
        } else {
            this.wifiNode.active = false;
            this.signalNode.active = true;
            this.setSingalStrength(data.signal);
        }
    },
    onPhoneBatteryEvent: function onPhoneBatteryEvent(data) {
        this.isChargerNode.active = data.status && data.status > 0;
        this.batteryProgress.progress = data.level;
    },
    setWifiStrength: function setWifiStrength() {
        var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        if (cc.sys.os === cc.sys.OS_IOS) {
            num += 1;
        }
        var name = 'wifi_' + num;
        this.wifiNode.children.forEach(function (value) {
            if (value.name === name) {
                value.active = true;
            } else {
                value.active = false;
            }
        });
    },
    setSingalStrength: function setSingalStrength() {
        var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var name = 'xinhao_' + num;
        this.signalNode.children.forEach(function (value) {
            if (value.name === name) {
                value.active = true;
            } else {
                value.active = false;
            }
        });
    },
    formatTime: function formatTime() {
        var d = new Date(this._currTime);
        var h = d.getHours();
        if (h < 10) {
            h = "0" + h;
        }
        var m = d.getMinutes();
        if (m < 10) {
            m = "0" + m;
        }
        this.timeLabel.string = h + ":" + m;
    }
});

cc._RF.pop();