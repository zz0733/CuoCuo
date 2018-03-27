cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {

    },
    //玩家要不起，请求过
//     message ddz_play_pass_req {
//     optional int64 userId = 1;
// }
    onClickPassCard: function () {
        fun.net.send("PID_PASS_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
        }, function () {
            cc.YL.log("过牌发送OK");
        }.bind(this));
    },
});
