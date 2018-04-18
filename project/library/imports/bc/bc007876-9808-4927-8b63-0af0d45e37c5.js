"use strict";
cc._RF.push(module, 'bc007h2mAhJJ4tjCvDUXjfF', 'DDZ_JiaoFen');
// poker/DDZ/Script/Game/DDZ_JiaoFen.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    //玩家请求叫分
    //     message ddz_play_jiaoFen_req {
    //     optional int64 userId = 1; //叫分的玩家
    //     optional jiaoFenOption fen = 2; //叫的多少分
    // }

    start: function start() {},

    initJIaoFenUI: function initJIaoFenUI(data) {
        var list = data.option;
        for (var i = 0; i < list.length; i++) {
            this.node.getChildByName(list[i] + "").active = true;
        }
    },
    onClickNoPoint: function onClickNoPoint() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 0
        });
    },
    onClickOnePoint: function onClickOnePoint() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 1
        });
    },
    onClickTwoPoint: function onClickTwoPoint() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 2
        });
    },
    onClickThreePoint: function onClickThreePoint() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 3
        });
    },
    onClickSixPoint: function onClickSixPoint() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 6
        });
    },
    onClickNinePoint: function onClickNinePoint() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 9
        });
    }
    // update (dt) {},
});

cc._RF.pop();