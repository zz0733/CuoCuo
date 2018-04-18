(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Game/DDZ_JiaBei.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8af9aN4JPtEhItLXiFLaD2+', 'DDZ_JiaBei', __filename);
// poker/DDZ/Script/Game/DDZ_JiaBei.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    start: function start() {},

    //玩家请求加倍
    //     message ddz_play_jiaBei_req {
    //     optional int64 userId = 1;
    //     optional bool isJiaBei = 2;
    // }
    onClickJiaBei: function onClickJiaBei() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_JIABEI_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            isJiaBei: true
        });
    },
    onClickNoJiaBei: function onClickNoJiaBei() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_JIABEI_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            isJiaBei: false
        });
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
        //# sourceMappingURL=DDZ_JiaBei.js.map
        