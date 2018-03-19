cc.Class({
    extends: cc.Component,

    properties: {
        wifiNode: {
            type: cc.Node,
            default: null,
        },

        signalNode: {
            type: cc.Node,
            default: null,
        },

        isChargerNode: {
            type: cc.Node,
            default: null,
        },

        batteryProgress: {
            type: cc.ProgressBar,
            default: null,
        },

        timeLabel: {
            type: cc.Label,
            default: null,
        },
    },

    onLoad () {
        fun.event.add('PhoneNetPhoneStatusWahua', 'PhoneNet', this.onPhoneNetEvent.bind(this));
        fun.event.add('PhoneBatteryPhoneStatusWahua', 'PhoneBattery', this.onPhoneBatteryEvent.bind(this));
        require("JSPhoneNetBattery").getNetBatteryStatus();
        this._sumdt = 0;
        this._currTime = Date.now();
        this.formatTime();
    },

    onDestroy () {
        fun.event.remove('PhoneNetPhoneStatusWahua');
        fun.event.remove('PhoneBatteryPhoneStatusWahua');
    },

    update (dt) {
        this._sumdt += dt;
        if (this._sumdt < 1) {
            return;
        }
        this._sumdt -= 1;
        this._currTime += 1000;
        this.formatTime();
    },

    onPhoneNetEvent(data) {
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

    onPhoneBatteryEvent(data) {
        this.isChargerNode.active = (data.status && (data.status > 0));
        this.batteryProgress.progress = data.level;
    },

    setWifiStrength(num = 0) {
        if (cc.sys.os === cc.sys.OS_IOS) {
            num += 1;
        }
        const name = 'wifi_' + num;
        this.wifiNode.children.forEach(function(value) {
            if (value.name === name) {
                value.active = true;
            } else {
                value.active = false;
            }
        });
    },

    setSingalStrength(num = 0) {
        const name = 'xinhao_' + num;
        this.signalNode.children.forEach(function(value) {
            if (value.name === name) {
                value.active = true;
            } else {
                value.active = false;
            }
        });
    },

    formatTime() {
        let d = new Date(this._currTime);
        let h = d.getHours();
        if (h < 10) {
            h = "0" + h;
        }
        let m = d.getMinutes();
        if (m < 10) {
            m = "0" + m;
        }
        this.timeLabel.string = h + ":" + m;
    },
});
