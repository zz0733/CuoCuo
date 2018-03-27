cc.Class({
    extends: cc.Component,

    properties: {},


    start () {

    },
//玩家请求加倍
//     message ddz_play_jiaBei_req {
//     optional int64 userId = 1;
//     optional bool isJiaBei = 2;
// }
    onClickJiaBei: function () {
        fun.net.send("PID_JIABEI_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            isJiaBei: true,
        }, function () {
            cc.YL.log("加倍发送OK");
        }.bind(this));
    },
    onClickNoJiaBei: function () {
        fun.net.send("PID_JIABEI_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            isJiaBei: false,
        }, function () {
            cc.YL.log("不加倍发送OK");
        }.bind(this));
    },
});
