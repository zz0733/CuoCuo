cc.Class({
    extends: cc.Component,

    properties: {},


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
    initBtnStatus:function (isNew) {
        if(isNew == true){
            this.node.getChildByName("0").active = false;
            this.node.getChildByName("2").active = false;
        }else{
            this.node.getChildByName("0").active = true;
            this.node.getChildByName("2").active = true;
        }
    },
    onClickOutCard: function () {
        fun.net.send("PID_OUTCARD_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
            paiIds: cc.YL.playerOutPokerArr,
        });
    },
    onClickPassCard: function () {
        fun.net.send("PID_PASS_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
        });
    },
    onClickTiShiCard: function () {
        cc.YL.DDZPokerTip.clickTipsBtn(cc.YL.lastOutCardData.outType, cc.YL.lastOutCardData.paiIds.length, cc.YL.lastOutCardData.paiIds);
    },
});
