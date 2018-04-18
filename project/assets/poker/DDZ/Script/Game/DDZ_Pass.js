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
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_PASS_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
        });
    },
});
