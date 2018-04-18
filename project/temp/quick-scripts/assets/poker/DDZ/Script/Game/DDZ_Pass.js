(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Game/DDZ_Pass.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4f2c3e74YZAdbrbSRR/cdFe', 'DDZ_Pass', __filename);
// poker/DDZ/Script/Game/DDZ_Pass.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    start: function start() {},

    //玩家要不起，请求过
    //     message ddz_play_pass_req {
    //     optional int64 userId = 1;
    // }
    onClickPassCard: function onClickPassCard() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_PASS_REQ", {
            userId: fun.db.getData('UserInfo').UserId
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
        //# sourceMappingURL=DDZ_Pass.js.map
        