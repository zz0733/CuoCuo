let className = 'org/cocos2dx/javascript/AppActivity';
let ApplePayPrice = [ 6, 18, 50, 128, 298, 618 ];

let device = {

    getDeviceUUID(){
        let uuid;
        if(cc.sys.os === cc.sys.OS_ANDROID)
            uuid = jsb.reflection.callStaticMethod(className, 'getDeviceUUID', '()Ljava/lang/String;');
        else if(cc.sys.os === cc.sys.OS_IOS)
            uuid = jsb.reflection.callStaticMethod('OCPhoneDevice', 'getDeviceUUID');
        console.log('---* js getDeviceUUID *---');
        console.log(uuid)
    },

    ApplePay(strId){
        if(cc.sys.os !== cc.sys.OS_IOS) return;
        jsb.reflection.callStaticMethod('OCPhoneDevice', 'ApplePay:', strId);
    },

    ReApplePayResult(result, receipt){
    	console.log('---* js ReApplePayResult *---');
        console.log('result:  ' + result);
        console.log('receipt: ' + receipt);
        if (receipt !== '') {
            let applePayStr = JSON.stringify({check: true, receipt: receipt});
            cc.sys.localStorage.setItem('applePayReceiptStr', applePayStr);
        }
        fun.event.dispatch('PhonePayResult', {from: 'apple', result: result, receipt: receipt});
    }

}

module.exports = device;
