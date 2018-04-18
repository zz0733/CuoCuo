"use strict";
cc._RF.push(module, '12dfeItydlEObeEgOaTxwrh', 'DDZ_Sound');
// poker/DDZ/Script/Common/DDZ_Sound.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
/*********
 *  斗地主声音，音效管理
 *  *******/
var DDZ_Audio = cc.Class({});
DDZ_Audio.bindPath = function () {
    this._manPath = "res/raw-assets/resources/poker/DDZ/Audio/Man/";
    this._womanPath = "res/raw-assets/resources/poker/DDZ/Audio/Woman/";
    this._commonPath = "res/raw-assets/resources/poker/DDZ/Audio/Common/";
};
DDZ_Audio.playerOutSound = function (data) {
    this.bindPath();
    var soundPath = null;
    var typePath = ["", "s_", "dui_", "sanbudai", "sandaiyi", "sandaidui", "shunzi", "liandui", "feiji", "feiji", "feiji", "sidaidui", "sidaier", "zadan", "wangza"];
    var numStr = "";
    if (data.outType == 1 || data.outType == 2) {
        numStr = cc.YL.cardtypeArrTrans.TransPokertypeArr(data.paiIds[0]).Num;
    }
    var playArr = [typePath[data.outType] + numStr, "daguo_1", "daguo_2", "daguo_3"];
    if (fun.db.getData('UserInfo').UserId == data.retMsg.userId) {
        cc.YL.DDZselfPlayerInfo.sex == 1 ? soundPath = this._manPath + playArr[0] : soundPath = this._womanPath + playArr[0];
    }
    if (cc.YL.DDZrightPlayerInfo) {
        if (data.retMsg.userId == cc.YL.DDZrightPlayerInfo.userId) {
            cc.YL.DDZselfPlayerInfo.sex == 1 ? soundPath = this._manPath + playArr[0] : soundPath = this._womanPath + playArr[0];
        }
    }
    if (cc.YL.DDZleftPlayerInfo) {
        if (data.retMsg.userId == cc.YL.DDZleftPlayerInfo.userId) {
            cc.YL.DDZselfPlayerInfo.sex == 1 ? soundPath = this._manPath + playArr[0] : soundPath = this._womanPath + playArr[0];
        }
    }
    if (soundPath) {
        this.playE(soundPath + ".mp3");
    }
};
DDZ_Audio.playSpecialEffect = function (userId, str) {
    this.bindPath();
    var soundPath = null;
    if (fun.db.getData('UserInfo').UserId == userId) {
        cc.YL.DDZselfPlayerInfo.sex == 1 ? soundPath = this._manPath + str : soundPath = this._womanPath + str;
    }
    if (cc.YL.DDZrightPlayerInfo) {
        if (userId == cc.YL.DDZrightPlayerInfo.userId) {
            cc.YL.DDZrightPlayerInfo.sex == 1 ? soundPath = this._manPath + str : soundPath = this._womanPath + str;
        }
    }
    if (cc.YL.DDZleftPlayerInfo) {
        if (userId == cc.YL.DDZleftPlayerInfo.userId) {
            cc.YL.DDZleftPlayerInfo.sex == 1 ? soundPath = this._manPath + str : soundPath = this._womanPath + str;
        }
    }
    if (soundPath) {
        this.playE(soundPath + ".mp3");
    }
};
DDZ_Audio.playPass = function (userId) {
    this.bindPath();
    var soundPath = null;
    if (fun.db.getData('UserInfo').UserId == userId) {
        cc.YL.DDZselfPlayerInfo.sex == 1 ? soundPath = this._manPath + "pass_" + this.rangeInt(1, 3) : soundPath = this._womanPath + "pass_" + this.rangeInt(1, 3);
    }
    if (cc.YL.DDZrightPlayerInfo) {
        if (userId == cc.YL.DDZrightPlayerInfo.userId) {
            cc.YL.DDZrightPlayerInfo.sex == 1 ? soundPath = this._manPath + "pass_" + this.rangeInt(1, 3) : soundPath = this._womanPath + "pass_" + this.rangeInt(1, 3);
        }
    }
    if (cc.YL.DDZleftPlayerInfo) {
        if (userId == cc.YL.DDZleftPlayerInfo.userId) {
            cc.YL.DDZleftPlayerInfo.sex == 1 ? soundPath = this._manPath + "pass_" + this.rangeInt(1, 3) : soundPath = this._womanPath + "pass_" + this.rangeInt(1, 3);
        }
    }
    if (soundPath) {
        this.playE(soundPath + ".mp3");
    }
};
DDZ_Audio.playWaring = function (userId, num) {
    this.bindPath();
    var soundPath = null;
    if (fun.db.getData('UserInfo').UserId == userId) {
        cc.YL.DDZselfPlayerInfo.sex == 1 ? soundPath = this._manPath + "last_" + num : soundPath = this._womanPath + "last_" + num;
    }
    if (cc.YL.DDZrightPlayerInfo) {
        if (userId == cc.YL.DDZrightPlayerInfo.userId) {
            cc.YL.DDZrightPlayerInfo.sex == 1 ? soundPath = this._manPath + "last_" + num : soundPath = this._womanPath + "last_" + num;
        }
    }
    if (cc.YL.DDZleftPlayerInfo) {
        if (userId == cc.YL.DDZleftPlayerInfo.userId) {
            cc.YL.DDZleftPlayerInfo.sex == 1 ? soundPath = this._manPath + "last_" + num : soundPath = this._womanPath + "last_" + num;
        }
    }
    if (soundPath) {
        this.playE(soundPath + ".mp3");
    }
};
DDZ_Audio.rangeInt = function (start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
};
DDZ_Audio.playBtnClick = function () {
    this.playE("res/raw-assets/resources/hall/audio/sound/button_nomal.mp3");
};
DDZ_Audio.playBtnClose = function () {
    this.playE("res/raw-assets/resources/hall/audio/sound/button_close.mp3");
};
DDZ_Audio.playMsgMusic = function (userId, index) {
    this.bindPath();
    var soundPath = null;
    var pathName = "";
    if (fun.db.getData('UserInfo').UserId == userId) {
        index >= 10 ? pathName = "male_talk0" : pathName = "male_talk00";
        cc.YL.DDZselfPlayerInfo.sex == 1 ? soundPath = this._manPath + pathName + index : soundPath = this._womanPath + pathName + index;
    }
    if (cc.YL.DDZrightPlayerInfo) {
        if (userId == cc.YL.DDZrightPlayerInfo.userId) {
            index >= 10 ? pathName = "male_talk0" : pathName = "male_talk00";
            cc.YL.DDZrightPlayerInfo.sex == 1 ? soundPath = this._manPath + pathName + index : soundPath = this._womanPath + pathName + index;
        }
    }
    if (cc.YL.DDZleftPlayerInfo) {
        if (userId == cc.YL.DDZleftPlayerInfo.userId) {
            index >= 10 ? pathName = "male_talk0" : pathName = "male_talk00";
            cc.YL.DDZleftPlayerInfo.sex == 1 ? soundPath = this._manPath + pathName + index : soundPath = this._womanPath + pathName + index;
        }
    }
    if (soundPath) {
        this.playE(soundPath + ".mp3");
    }
};
DDZ_Audio.playCommonBGM = function (type) {
    this.bindPath();
    var typeArr = ["Bomb", "Chuntian", //0,1
    "SelectCard", "Special_star", //2,3
    "alert", "plane", //4,5
    "wang_Bomb"]; //6
    this.playE(this._commonPath + typeArr[type] + ".mp3");
};
DDZ_Audio.playFaPai = function () {
    this.playE("res/raw-assets/resources/poker/audio/sound/fapai.mp3");
};
DDZ_Audio.playE = function (str) {
    var data = cc.sys.localStorage.getItem('valumeData');
    if (data) {
        var soundData = JSON.parse(data);
        this.effect = str;
        if (soundData.sound == 0) {
            cc.audioEngine.stop(this.effect);
        } else {
            cc.audioEngine.play(this.effect);
            cc.audioEngine.setVolume(this.effect, soundData.sound);
        }
    } else {
        var valumeData = JSON.stringify({ sound: 0.1, music: 0.1 });
        cc.sys.localStorage.setItem('valumeData', valumeData);
        cc.audioEngine.play(str);
    }
};
DDZ_Audio.playBGM = function () {
    var data = cc.sys.localStorage.getItem('valumeData');
    var rootNode = cc.find("DDZ_UIROOT/MainNode");
    if (data) {
        var soundData = JSON.parse(data);
        if (soundData.music == 0) {
            rootNode.getComponent(cc.AudioSource).mute = true;
        } else if (soundData.music == this.musicV) {
            rootNode.getComponent(cc.AudioSource).volume = soundData.music;
            this.musicV = soundData.music;
            rootNode.getComponent(cc.AudioSource).mute = false;
            // if(rootNode.getComponent(cc.AudioSource).isPlaying == false){
            //     rootNode.getComponent(cc.AudioSource).mute = false;
            //     rootNode.getComponent(cc.AudioSource).play();
            // }
        } else {
            rootNode.getComponent(cc.AudioSource).volume = soundData.music;
            this.musicV = soundData.music;
            rootNode.getComponent(cc.AudioSource).mute = false;
            rootNode.getComponent(cc.AudioSource).play();
        }
    } else {
        var valumeData = JSON.stringify({ sound: 0.1, music: 0.1 });
        cc.sys.localStorage.setItem('valumeData', valumeData);
        rootNode.getComponent(cc.AudioSource).volume = 0.1;
        rootNode.getComponent(cc.AudioSource).mute = false;
        rootNode.getComponent(cc.AudioSource).play();
    }
};
module.exports = DDZ_Audio;
cc.YL.DDZAudio = DDZ_Audio;

cc._RF.pop();