let PukeDefine = require('PukeDefine');
let PukeData   = require('PukeData');
let PukeUtils  = require('PukeUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        Background: cc.Node,
        phoneStatus: cc.Node
    },

    onLoad: function () {
        PukeData.init();
        this.skinPeeler(PukeData.getSkin());
        this.scheduleTime();  //时间显示
        this.refreTimeCount = 1;
    },

    start: function () {
        fun.event.add('PukeCommUI_PukeSkin', 'PukeSkin',     this.skinPeeler.bind(this));
        fun.event.add('PukeCommUI_Battery',  'PhoneBattery', this.batteryStatus.bind(this));
        fun.event.add('PukeCommUI_Net',      'PhoneNet',     this.netStatus.bind(this));
        require('JSPhoneNetBattery').getNetBatteryStatus();
    },
    
    update: function(dt){
        this.totalDtTime = (this.totalDtTime || 0) + dt;
        if(this.totalDtTime > this.refreTimeCount){
            this.totalDtTime -= this.refreTimeCount;
            this.scheduleTime();
        }
    },

    onDestroy: function(){
        fun.event.remove('PukeCommUI_PukeSkin');
        fun.event.remove('PukeCommUI_Battery');
        fun.event.remove('PukeCommUI_Net');
    },

    //-- 显示系统时间
    scheduleTime: function () {
        let date = new Date();
        this.lastMinutes = this.lastMinutes || date.getMinutes();
        let minutesStr = date.getMinutes() < 10 ? "0"+ date.getMinutes() : date.getMinutes();
        let hoursStr = date.getHours() < 10 ? "0"+ date.getHours() : date.getHours();
        let systemTime = date.getHours() + ":" + minutesStr
        if(this.lastMinutes < date.getMinutes() && this.refreTimeCount == 1){
            this.refreTimeCount = 30;
        }
        this.lastMinutes = date.getMinutes();
        this.phoneStatus.getChildByName("time").getComponent(cc.Label).string = systemTime;
    },

    //-- 电池状态
    batteryStatus: function(msg){
        let isCharge = this.phoneStatus.getChildByName("charge");
        let progress = this.phoneStatus.getChildByName("battery");
        isCharge.active = (msg.status === 0 || msg.status === 1) ? false : true;
        progress.getComponent(cc.ProgressBar).progress = msg.level/100; 
    },

    //-- 网络状态
    netStatus: function(msg){
        let wifi = this.phoneStatus.getChildByName("wifi");
        let signal = this.phoneStatus.getChildByName("signal");
        if (msg.status === 5){
            wifi.active = true;
            signal.active = false;
            for (let i=1; i<=4; ++i) {
                wifi.getChildByName('pk_wifi_'+i).active = false;
            }
            wifi.getChildByName('pk_wifi_'+msg.strength).active = true;
        } else {
            wifi.active = false;
            signal.active = true;
            for (let i=1; i<=5; ++i) {
                signal.getChildByName('pk_signal_'+i).active = false;
            }
            let sg = msg.signal;
            signal.getChildByName('pk_signal_'+(msg.signal+1)).active = true;
        }
    },

    //-- 换肤
    skinPeeler: function(skinNum){
        let self = this;
        PukeUtils.LoadRes(PukeDefine.BACKGROUND[skinNum-1], "SpriteFrame", function(frame){
            self.Background.getComponent(cc.Sprite).spriteFrame = frame;
        });
    }

});
