"use strict";
cc._RF.push(module, '4f2c3e74YZAdbrbSRR/cdFe', 'DDZ_Pass');
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