let className = 'org/cocos2dx/javascript/AppActivity';
let umeng = {

    umengAnalytics : function(info){
        var strInfo = JSON.stringify(info);
        if(cc.sys.os === cc.sys.OS_ANDROID)
            jsb.reflection.callStaticMethod(className, 'UmengSDK', '(Ljava/lang/String;)V', strInfo);
        else if (cc.sys.os === cc.sys.OS_IOS)
            jsb.reflection.callStaticMethod('NativeOcClass', 'UmengSDK:', strInfo);
        
    },

}

module.exports = umeng;
