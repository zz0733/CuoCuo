"use strict";
cc._RF.push(module, '8af9aN4JPtEhItLXiFLaD2+', 'DDZ_JiaBei');
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