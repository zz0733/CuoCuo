"use strict";
cc._RF.push(module, 'cc151LWgchNTrn8yRH8f/md', 'JSPhoneVoice');
// phone/JSPhoneVoice.js

'use strict';

var className = 'org/cocos2dx/javascript/AppActivity';

var voice = {

    startAudio: function startAudio(name) {
        var filepath = cc.path.join(this.getVoicePath(), name);
        if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod(className, 'startAudio', '(Ljava/lang/String;)V', filepath);else if (cc.sys.os === cc.sys.OS_IOS) jsb.reflection.callStaticMethod('OCPhoneAudio', 'startAudio:', filepath);
    },

    stopAudio: function stopAudio() {
        if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod(className, 'stopAudio', '()V');else if (cc.sys.os === cc.sys.OS_IOS) jsb.reflection.callStaticMethod('OCPhoneAudio', 'stopAudio');
    },

    playAudio: function playAudio(name) {
        if (!cc.sys.isNative) {
            return;
        }
        var filepath = cc.path.join(this.getVoicePath(), name);
        if (!jsb.fileUtils.isFileExist(filepath + '.mp3')) {
            console.log('---* js. voice file not exist. *---');
            return;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod(className, 'playAudio', '(Ljava/lang/String;)V', filepath);else if (cc.sys.os === cc.sys.OS_IOS) jsb.reflection.callStaticMethod('OCPhoneAudio', 'playAudio:', filepath);
    },

    getVoiceDataByName: function getVoiceDataByName(name) {
        if (!cc.sys.isNative) {
            return;
        }
        var fileName = cc.path.join(this.getVoicePath(), name + '.mp3');
        if (!jsb.fileUtils.isFileExist(fileName)) {
            console.log('---* js. voice file not exist. *---');
            return null;
        }
        var voiceData = jsb.fileUtils.getDataFromFile(fileName);
        return fun.base64.fromByteArray(voiceData);
    },

    writeVoiceData: function writeVoiceData(data, name) {
        if (!cc.sys.isNative) {
            return;
        }
        var fileName = cc.path.join(this.getVoicePath(), name + '.mp3');
        var voiceData = fun.base64.toByteArray(data);
        jsb.fileUtils.writeDataToFile(voiceData, fileName);
    },

    getVoicePath: function getVoicePath() {
        if (!cc.sys.isNative) {
            return;
        }
        return cc.path.join(jsb.fileUtils.getWritablePath(), 'VoiceChatPath/');
    },

    clearOldVoice: function clearOldVoice() {
        if (!cc.sys.isNative) {
            return;
        }
        var dirpath = cc.path.join(jsb.fileUtils.getWritablePath(), 'VoiceChatPath/');
        if (jsb.fileUtils.isDirectoryExist(dirpath)) {
            jsb.fileUtils.removeDirectory(dirpath);
        }
        jsb.fileUtils.createDirectory(dirpath);
    }
};

module.exports = voice;

cc._RF.pop();