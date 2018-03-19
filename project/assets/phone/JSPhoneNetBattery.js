let className = 'org/cocos2dx/javascript/AppActivity';
let netBattery = {

    //== 获取手机网络和电池状态 (进入游戏界面时调用)
    getNetBatteryStatus : function(){
        if(cc.sys.os === cc.sys.OS_ANDROID)
            jsb.reflection.callStaticMethod(className, 'getNetBatteryStatus', '()V');
        else if(cc.sys.os === cc.sys.OS_IOS)
            jsb.reflection.callStaticMethod('OCPhoneNetBattery', 'getNetBatteryStatus');
    },

    //-- 返回手机电池状态 ( 必须要先调用一次 getNetBatteryStatus() )
    reBattery : function(status, level){
        console.log('---* js reBattery *---');
        console.log('status: ' + status); // status = 0-未知情况 1-未充电状态  2-正在充电但未充满 3-已充满电
        console.log('level:  ' + level);  // 电池电量 0-100
        fun.event.dispatch('PhoneBattery', {status: parseInt(status), level: parseInt(level)});
    },

    //返回手机网络状态和运营商 ( 必须要先调用一次 getNetBatteryStatus() )
    reNet : function(status, strength, signal){
        console.log('---* js reNet *---');
        console.log('status:   ' + status);   // status = 5 Wifi  2/3/4 流量   0/其他 无网络
        console.log('strength: ' + strength); // Wifi强度  ios:1-3  android 1-4
        console.log('signal:   ' + signal);   // 手机信号强度 0网络错误 1网络很差 2网络还行 3网络不错 4网络很好
        if(status === 5 && cc.sys.os === cc.sys.OS_IOS)
            strength = parseInt(strength) + 1;
        fun.event.dispatch('PhoneNet', {status: parseInt(status), strength: parseInt(strength), signal: parseInt(signal)});
    }

}

module.exports = netBattery;