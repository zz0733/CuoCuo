
cc.Class({
    extends: cc.Component,

    properties: {
    },


//玩家出牌的请求
//     message ddz_play_outCards_req {
//     optional int64 userId = 1;
//     repeated int32 paiIds = 2;
// }
    //玩家要不起，请求过
//     message ddz_play_pass_req {
//     optional int64 userId = 1;
// }
    start () {

    },
    onClickOutCard: function(){
        fun.net.send("PID_OUTCARD_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            paiIds:  cc.YL.playerOutPokerArr,
        });
    },
    onClickPassCard: function(){
        fun.net.send("PID_PASS_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
        });
    },
    onClickTiShiCard: function(){
        cc.YL.PokerTip.clickTipsBtn(2, 2, [3, 3, 3, 4, 4, 4, 5, 6]);
    },
});
