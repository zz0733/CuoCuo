"use strict";
cc._RF.push(module, '2b805Jn+SlJ9pGeZcuyfzTN', 'DDZ_Animation');
// poker/DDZ/Script/Common/DDZ_Animation.js

"use strict";

var DDZ_Animation = cc.Class({});
DDZ_Animation.bindplayNode = function () {
    var AnimRoot = cc.find("DDZ_UIROOT/MainNode/AnimationRoot");
    AnimRoot.zIndex = 900;
    this.UIROOTCOM = AnimRoot.getComponent("DDZ_AnimationManager");
};
DDZ_Animation.playSpring = function (spr, respr) {
    this.bindplayNode();
    this.UIROOTCOM.PlaySpring(spr, respr);
    cc.YL.DDZAudio.playCommonBGM(1);
};
DDZ_Animation.playBoom = function (playerIndex) {
    this.bindplayNode();
    this.UIROOTCOM.PlayBoom(playerIndex);
};
DDZ_Animation.playWaring = function (index) {
    this.bindplayNode();
    this.UIROOTCOM.PlayWaring(index);
    cc.YL.DDZAudio.playCommonBGM(4);
};
DDZ_Animation.playDizhu = function (playerIndex) {
    this.bindplayNode();
    this.UIROOTCOM.PlayDizhu(playerIndex);
};
DDZ_Animation.playShunziLianduiFeiji = function (playerIndex, str) {
    this.bindplayNode();
    this.UIROOTCOM.PlayShunLianFei(playerIndex, str);
};
DDZ_Animation.playRocket = function (playerIndex) {
    this.bindplayNode();
    this.UIROOTCOM.PlayRocket(playerIndex);
};
DDZ_Animation.playAnimationByType = function (playerIndex, type) {
    if (playerIndex == -1) {
        cc.YL.err("错误的玩家index");
        return;
    }
    switch (type) {
        case 6:
            {
                // 顺子
                this.playShunziLianduiFeiji(playerIndex, "Shunzi");
                cc.YL.DDZAudio.playCommonBGM(3);
                break;
            }
        case 7:
            {
                //连对
                this.playShunziLianduiFeiji(playerIndex, "Liandui");
                cc.YL.DDZAudio.playCommonBGM(3);
                break;
            }
        case 8:
        case 9:
        case 10:
            {
                //飞机
                this.playShunziLianduiFeiji(playerIndex, "Feiji");
                cc.YL.DDZAudio.playCommonBGM(5);
                break;
            }
        case 13:
            {
                //炸弹
                this.playBoom(playerIndex);
                cc.YL.DDZAudio.playCommonBGM(0);
                break;
            }
        case 14:
            {
                //王炸
                this.playRocket(playerIndex);
                cc.YL.DDZAudio.playCommonBGM(6);
            }
    }
};
module.exports = DDZ_Animation;
cc.YL.DDZAnimation = DDZ_Animation;

cc._RF.pop();