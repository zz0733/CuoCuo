// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
/**********
 * 单局游戏结束时的处理
 * 和全局游戏结束的脚本功能6一致
 * ******/
cc.Class({
    extends: cc.Component,

    properties: {
        pokerPre: cc.Prefab,
    },


    start () {
//         message ddz_play_userRoundLotteryInfo {
//             optional int64 userId = 1;
//             optional int32 score = 2; //单局得分
//             optional int32 totalScore = 3; //总得分
//             optional int32 rate = 4; //倍数
//             optional int32 boomCount = 5; //炸弹数量
//             optional bool isWinner = 6; //是否是赢家
//             repeated int32 handPokers = 7; //手牌
//             repeated int32 remainPokers = 8; //剩余手牌
//             optional bool isDiZhu = 9; //是否是地主
//             optional string extend = 10; //扩展字段
//         }
//
// //单局结算
//         message ddz_play_roundResult {
//             repeated ddz_play_userRoundLotteryInfo usersRoundLotteryInfo = 1;
//             optional int32 currentRound = 2; //当前局数
//             optional int32 roundLimit = 3; //总的局数
//             optional uint32 password = 4;
//         }
    },
    initNodeForSimple: function (data) {
        this.selfID = fun.db.getData('UserInfo').UserId;
        this.selfNode = this.node.getChildByName("Self");
        this.rightNode = this.node.getChildByName("Right");
        this.leftNode = this.node.getChildByName("Left");
        for (var i = 0; i < data.usersRoundLotteryInfo.length; i++) {
            if (this.selfID == data.usersRoundLotteryInfo[i].userId) {
                this.initSelf(data[i]);
            }
            if (data.usersRoundLotteryInfo[i].userId == cc.YL.DDZrightPlayerInfo.userId) {
                this.initRight(data[i]);
            }
            if (data.usersRoundLotteryInfo[i].userId == cc.YL.DDZleftPlayerInfo.userId) {
                this.initLeft(data[i]);
            }
        }
    },

    initSelf: function (data) {
        var list = data.remainPokers;
        var startPosX = (list.length - 1) * (-25);
        for (var i = 0; i < list.length; i++) {
            var pokerNode = this.initPoker(list[i]);
            this.selfNode.addChild(pokerNode);
            var posX = startPosX + i * 50;
            pokerNode.setPosition(posX, 0);
            pokerNode.setTag(posX);
        }
    },

    initRight: function (data) {
        var list = data.remainPokers;
        list = list.reverse();
        for (var i = 0; i < list.length; i++) {
            var pokerNode = this.initPoker(list[i]);
            var posX = -(i * 50);
            pokerNode.setPosition(posX, 0);
            this.rightNode.addChild(pokerNode);
            pokerNode.zIndex = list.length - i;
            pokerNode.setTag(posX);
        }
    },

    initLeft: function (data) {
        var list = data.remainPokers;
        for (var i = 0; i < list.length; i++) {
            var pokerNode = this.initPoker(list[i]);
            this.leftNode.addChild(pokerNode);
            var posX = i * 50;
            pokerNode.setPosition(posX, 0);
            pokerNode.setTag(posX);

        }
    },

    onClickContinue: function () {

    },

    onClickDetail: function () {

    },
    initPoker: function (ID) {
        var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(ID);
        var newNode = cc.instantiate(this.pokerPre);
        newNode.getComponent("DDZ_Poker").initPoker(pokerObj);
        return newNode;
    },
    // update (dt) {},
});
