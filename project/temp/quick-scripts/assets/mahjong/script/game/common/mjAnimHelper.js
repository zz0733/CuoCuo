(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/game/common/mjAnimHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ef0a7mGJM5PUJwxj8c1CjOP', 'mjAnimHelper', __filename);
// mahjong/script/game/common/mjAnimHelper.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this.spAnim = this.node.getComponent(sp.Skeleton);
        var self = this;
        var completeFunc = function completeFunc(event) {
            self.onAnimFinish(event);
        };
        this.spAnim.setCompleteListener(completeFunc);
        this.initSpecialEndAnim();
        this.initOptPaiAnim();
        this.initCommonAnim();
    },

    onAnimFinish: function onAnimFinish(event) {
        if (this.onFinishCB) {
            this.onFinishCB();
        }
        this.onFinishCB = undefined;
        this.node.removeFromParent();
    },

    initSpecialEndAnim: function initSpecialEndAnim() {
        var creatAnimObj = function creatAnimObj(keyName, animName) {
            return { key: keyName, name: animName };
        };
        var animList = [];
        //显示优先级依次为：清一色、混一色、杠上开花、对对胡、自摸、胡
        //比如：清一色自摸，就只显示清一色，不显示自摸
        animList.push(creatAnimObj("isqys", "Qingyise")); //清一色
        animList.push(creatAnimObj("ishys", "Hunyise")); //混一色
        animList.push(creatAnimObj("isgsh", "Gangshangkaihua")); //杠上开花
        animList.push(creatAnimObj("isddh", "Duiduihu")); //对对胡
        animList.push(creatAnimObj("iszm", "Zimo")); //自摸
        this.endAnimList = animList;
    },

    initOptPaiAnim: function initOptPaiAnim() {
        var GameDefine = require("mjGameDefine");
        var optDefine = GameDefine.EATPAI_TYPE;
        var namelist = {};
        namelist[optDefine.ChiPai] = "Chi";
        namelist[optDefine.PengPai] = "Peng";
        namelist[optDefine.MingGang2] = "Gang";
        namelist[optDefine.AnGang] = "Gang";
        namelist[optDefine.MingGang1] = "Gang";
        namelist[optDefine.BuHua] = "Buhua";
        this.optPaiAnimList = namelist;
    },

    showSpeacilEndAnim: function showSpeacilEndAnim(endData) {
        var endAninName = "Hu";
        for (var i = 0; i < this.endAnimList.length; i++) {
            var animObj = this.endAnimList[i];
            if (endData[animObj.key]) {
                endAninName = animObj.name;
                break;
            }
        }
        this.spAnim.setAnimation(0, endAninName, false);
    },

    showOptPaiAnim: function showOptPaiAnim(eatType) {
        this.spAnim.setAnimation(0, this.optPaiAnimList[eatType], false);
    },

    initCommonAnim: function initCommonAnim() {
        var commonList = {};
        commonList["AnimShengpai"] = "Shengpai";
        commonList["AnimLiuju"] = "Liuju";
        commonList["AnimKaishi"] = "Kaishi";
        this.commonAnimList = commonList;
    },

    showCommonAnim: function showCommonAnim(key, handler) {
        var animName = this.commonAnimList[key];
        if (!animName) {
            this.node.removeFromParent();
        } else {
            this.onFinishCB = handler;
            // if(animName == "AnimLiuju"){
            //     cc.log("sssAnimLiuju ");
            //     this.node.getChildByName("liuju").active = true;
            //     var anim = this.node.getChildByName("liuju").getComponent(sp.Skeleton);
            //     anim.setAnimation(0, animName, false);
            // }else {
            this.spAnim.setAnimation(0, animName, false);
            // }
        }
    },

    progress: function progress() {
        // cc.Component.EventHandler.emitEvents([this.fireHandler]);
    },

    onFinish: function onFinish() {
        cc.Component.EventHandler.emitEvents([this.finishHandler]);
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
        //# sourceMappingURL=mjAnimHelper.js.map
        