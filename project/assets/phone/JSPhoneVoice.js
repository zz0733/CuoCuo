const className = 'org/cocos2dx/javascript/AppActivity';

let voice = {

    startAudio : function(name){
        const filepath = cc.path.join(this.getVoicePath(), name);
        if(cc.sys.os === cc.sys.OS_ANDROID)
            jsb.reflection.callStaticMethod(className, 'startAudio', '(Ljava/lang/String;)V', filepath);
        else if(cc.sys.os === cc.sys.OS_IOS)
            jsb.reflection.callStaticMethod('OCPhoneAudio', 'startAudio:', filepath);
    },

    stopAudio : function(){
        if(cc.sys.os === cc.sys.OS_ANDROID)
            jsb.reflection.callStaticMethod(className, 'stopAudio', '()V');
        else if(cc.sys.os === cc.sys.OS_IOS)
            jsb.reflection.callStaticMethod('OCPhoneAudio', 'stopAudio');
    },

    playAudio : function(name){
        if(!cc.sys.isNative){return}
        const filepath = cc.path.join(this.getVoicePath(), name);
        if(!jsb.fileUtils.isFileExist(filepath+'.mp3')){
            console.log('---* js. voice file not exist. *---');
            return;
        }
        if(cc.sys.os === cc.sys.OS_ANDROID)
            jsb.reflection.callStaticMethod(className, 'playAudio', '(Ljava/lang/String;)V', filepath);
        else if(cc.sys.os === cc.sys.OS_IOS)
            jsb.reflection.callStaticMethod('OCPhoneAudio', 'playAudio:', filepath);
    },

    getVoiceDataByName : function (name) {
        if(!cc.sys.isNative){return}
        const fileName = cc.path.join(this.getVoicePath(), name + '.mp3');
        if (!jsb.fileUtils.isFileExist(fileName)) {
            console.log('---* js. voice file not exist. *---');
            return null;
        }
        let voiceData = jsb.fileUtils.getDataFromFile(fileName);
        return fun.base64.fromByteArray(voiceData);
    },

    writeVoiceData : function(data, name) {
        if(!cc.sys.isNative){return}
        const fileName = cc.path.join(this.getVoicePath(), name + '.mp3');
        let voiceData = fun.base64.toByteArray(data);
        jsb.fileUtils.writeDataToFile(voiceData, fileName);
    },

    getVoicePath : function(){
        if(!cc.sys.isNative){return}
        return cc.path.join(jsb.fileUtils.getWritablePath(), 'VoiceChatPath/');
    },

    clearOldVoice : function () {
        if(!cc.sys.isNative){return}
        const dirpath = cc.path.join(jsb.fileUtils.getWritablePath(), 'VoiceChatPath/');
        if (jsb.fileUtils.isDirectoryExist(dirpath)) {
            jsb.fileUtils.removeDirectory(dirpath);
        }
        jsb.fileUtils.createDirectory(dirpath);
    },
}

module.exports = voice;