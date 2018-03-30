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
    initJIaoFenUI: function (data) {
        var list = data.option;
        for (var i = 0; i < list.length; i++) {
            this.node.getChildByName(list[i] + "").active = true;
        }
    },
    onClickNoPoint: function () {
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 0,
        });
    },
    onClickOnePoint: function () {
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 1,
        });
    },
    onClickTwoPoint: function () {
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 2,
        });
    },
    onClickThreePoint: function () {
        fun.net.send("PID_JIAOFEN_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            fen: 3,
        });
    },
    // update (dt) {},
});
