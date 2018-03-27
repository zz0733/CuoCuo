cc.Class({
    extends: cc.Component,

    properties: {},

//玩家请求叫分
//     message ddz_play_jiaoFen_req {
//     optional int64 userId = 1; //叫分的玩家
//     optional jiaoFenOption fen = 2; //叫的多少分
// }

    start () {

    },
    onClickNoPoint: function () {
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 0,
        }, function () {
            cc.YL.log("不加分发送OK");
        }.bind(this));
    },
    onClickOnePoint: function () {
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 1,
        }, function () {
            cc.YL.log("叫1分发送OK");
        }.bind(this));
    },
    onClickTwoPoint: function () {
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 2,
        }, function () {
            cc.YL.log("叫2分发送OK");
        }.bind(this));
    },
    onClickThreePoint: function () {
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 3,
        }, function () {
            cc.YL.log("叫3分发送OK");
        }.bind(this));
    },
    // update (dt) {},
});
