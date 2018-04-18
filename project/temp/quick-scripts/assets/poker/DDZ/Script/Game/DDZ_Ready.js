(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Game/DDZ_Ready.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '87859eCKxBO4p3gPk81YXHV', 'DDZ_Ready', __filename);
// poker/DDZ/Script/Game/DDZ_Ready.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    start: function start() {},

    onClickReady: function onClickReady() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_READY_REQ", {
            userId: fun.db.getData('UserInfo').UserId
        });
    },
    onClickShare: function onClickShare() {
        cc.YL.DDZAudio.playBtnClick();
        var payTypeArr = ["", "平均支付", "冠军支付", "房主支付"];
        var ruleList = [payTypeArr[cc.YL.DDZDeskInfo.roomInfo.payMode], "封顶:" + cc.YL.DDZDeskInfo.roomInfo.boomLimit];
        cc.YL.DDZDeskInfo.roomInfo.canSanDaiDui ? ruleList.push("可三带一对") : "";
        cc.YL.DDZDeskInfo.roomInfo.canSiDaiDui ? ruleList.push("可四带两对") : "";
        cc.YL.DDZDeskInfo.roomInfo.canDouble ? ruleList.push("可加倍") : "";
        for (var i = 0; i < ruleList.length; i++) {
            var content = ruleList[i] + " ";
        }
        var info = { content: content };
        info.title = "斗地主" + "-房间号：" + cc.YL.DDZDeskInfo.password;
        require("JSPhoneWeChat").WxShareFriend(info);
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
        //# sourceMappingURL=DDZ_Ready.js.map
        