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
        item: cc.Prefab,
        winFont: cc.Font,
        loseFont: cc.Font,
        Atlas: cc.SpriteAtlas,
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
        if(data.isSpring){
            this.node.getChildByName("Spring").active = true;
            this.node.getChildByName("Spring").setScale(0);
            this.node.getChildByName("Spring").stopAllActions();
            this.node.getChildByName("Spring").runAction(cc.sequence(cc.scaleTo(1,1.5),cc.scaleTo(0.2,1).easing(cc.easeBackOut())));
        }
        setTimeout(function () {
            this.initFirstUI(data);
        }.bind(this),data.isSpring == true ? 1500 : 10);

    },
    initFirstUI: function(data){
        this.selfID = fun.db.getData('UserInfo').UserId;
        this.firstNode = this.node.getChildByName("First");
        this.node.getChildByName("Spring").active = false;
        this.firstNode.active = true;
        this.node.getChildByName("Second").active = false;
        this.selfNode = this.firstNode.getChildByName("Self");
        this.rightNode = this.firstNode.getChildByName("Right");
        this.leftNode = this.firstNode.getChildByName("Left");
        this.oneGameOverData = data;
        for (var i = 0; i < data.usersRoundLotteryInfo.length; i++) {
            if (this.selfID == data.usersRoundLotteryInfo[i].userId) {
                this.initSelf(data.usersRoundLotteryInfo[i]);
                this.initIcon(data.usersRoundLotteryInfo[i]);
                this.isWin = data.usersRoundLotteryInfo[i].score >= 0 ? true : false;
            }
            if (data.usersRoundLotteryInfo[i].userId == cc.YL.DDZrightPlayerInfo.userId) {
                this.initRight(data.usersRoundLotteryInfo[i]);
            }
            if (data.usersRoundLotteryInfo[i].userId == cc.YL.DDZleftPlayerInfo.userId) {
                this.initLeft(data.usersRoundLotteryInfo[i]);
            }
        }
    },
    initSelf: function (data) {
        var list = data.remainPokers;
        if(list){
            list = cc.YL.DDZTools.SortPoker(list);
            var startPosX = (list.length - 1) * (-25);
            for (var i = 0; i < list.length; i++) {
                var pokerNode = this.initPoker(list[i]);
                this.selfNode.getChildByName("Poker").addChild(pokerNode);
                var posX = startPosX + i * 50;
                pokerNode.setPosition(posX, 0);
                pokerNode.setTag(posX);
            }
        }

        data.isWinner == true ?
            this.selfNode.getChildByName("Num").getComponent(cc.Label).string = "+" + data.score :
            this.selfNode.getChildByName("Num").getComponent(cc.Label).string =  data.score;
        data.isWinner == true ?
            this.selfNode.getChildByName("Num").getComponent(cc.Label).Font = this.winFont :
            this.selfNode.getChildByName("Num").getComponent(cc.Label).Font = this.loseFont;
    },

    initRight: function (data) {
        var list = data.remainPokers;
        if(list){
            list = cc.YL.DDZTools.SortPoker(list);
            list = list.reverse();
            for (var i = 0; i < list.length; i++) {
                var pokerNode = this.initPoker(list[i]);
                if(i > 10){
                    var posX = -((i - 11) * 50);
                    pokerNode.setPosition(posX, -100);
                    pokerNode.zIndex = 50 - i;
                }else{
                    var posX = -(i * 50);
                    pokerNode.setPosition(posX, 0);
                    pokerNode.zIndex = list.length - i;
                }
                this.rightNode.getChildByName("Poker").addChild(pokerNode);
                // pokerNode.zIndex = list.length - i;
                pokerNode.setTag(posX);
            }

        }
        data.isWinner == true ?
            this.rightNode.getChildByName("Num").getComponent(cc.Label).string = "+" + data.score :
            this.rightNode.getChildByName("Num").getComponent(cc.Label).string =  data.score;
        data.isWinner == true ?
            this.rightNode.getChildByName("Num").getComponent(cc.Label).Font = this.winFont :
            this.rightNode.getChildByName("Num").getComponent(cc.Label).Font = this.loseFont;

    },

    initLeft: function (data) {
        var list = data.remainPokers;
        if(list){
            list = cc.YL.DDZTools.SortPoker(list);
            for (var i = 0; i < list.length; i++) {
                var pokerNode = this.initPoker(list[i]);
                this.leftNode.getChildByName("Poker").addChild(pokerNode);
                if(i > 10){
                    var posX = (i - 11) * 50;
                    pokerNode.setPosition(posX, -100);
                }else{
                    var posX = i * 50;
                    pokerNode.setPosition(posX, 0);
                }
                pokerNode.setTag(posX);

            }
        }
        data.isWinner == true ?
            this.leftNode.getChildByName("Num").getComponent(cc.Label).string = "+" + data.score :
            this.leftNode.getChildByName("Num").getComponent(cc.Label).string = data.score;
        data.isWinner == true ?
            this.leftNode.getChildByName("Num").getComponent(cc.Label).font = this.winFont :
            this.leftNode.getChildByName("Num").getComponent(cc.Label).font = this.loseFont;
    },

    onClickContinue: function () {
        if (cc.YL.DDZAllGameOverData) {
            var UIROOT = cc.find("DDZ_UIROOT");
            UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showAllGameOver(cc.YL.DDZAllGameOverData);
        } else {
            fun.net.send("PID_READY_REQ", {
                userId: fun.db.getData('UserInfo').UserId,
            });
        }
        this.node.active = false;
        this.node.destroy();
    },
    onClickDetail: function () {
        this.firstNode.active = false;
        this.node.getChildByName("Second").active = true;
        this.initSecondUI(this.oneGameOverData);
    },
    initPoker: function (ID) {
        var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(ID);
        var newNode = cc.instantiate(this.pokerPre);
        newNode.getComponent("DDZ_Poker").initPoker(pokerObj);
        return newNode;
    },
    initIcon: function (data) {
        this.firstNode.getChildByName("ShowWinOrLose").active = true;
        var isShow = false;
        for(var i = 0; i< this.firstNode.getChildByName("ShowWinOrLose").children.length;i++){
            this.firstNode.getChildByName("ShowWinOrLose").children[i].active = false;
        }
        if(isShow == true){
            return;
        }
        if (data.isDiZhu == true) {
            data.isWinner == true ?
                this.firstNode.getChildByName("ShowWinOrLose").getChildByName("1").active = true :
                this.firstNode.getChildByName("ShowWinOrLose").getChildByName("2").active = true;
        } else {
            data.isWinner == true ?
                this.firstNode.getChildByName("ShowWinOrLose").getChildByName("3").active = true :
                this.firstNode.getChildByName("ShowWinOrLose").getChildByName("4").active = true;
        }
        this.firstNode.getChildByName("ShowWinOrLose").stopAllActions();
        this.firstNode.getChildByName("ShowWinOrLose").setScale(0);
        this.firstNode.getChildByName("ShowWinOrLose").runAction(cc.scaleTo(0.9,1.2).easing(cc.easeBackOut()));
        setTimeout(function () {
            this.firstNode.getChildByName("ShowWinOrLose").active = false;
            isShow = true;
        }.bind(this),2000);
    },
    /***********************************第一个界面***************************************/


    /***********************************第二个界面***************************************/
    initSecondUI: function (data) {
        this.node.getChildByName("Spring").active = false;
        this.ButtomNode = this.node.getChildByName("Second").getChildByName("Buttom");
        this.MidNode = this.node.getChildByName("Second").getChildByName("Mid");
        this.TopNode = this.node.getChildByName("Second").getChildByName("Top");
        this.initTitle();
        this.initButtomInfo(data);
        this.initItem(data);
    },
    initTitle: function () {
        if (this.isWin == true) {
            this.TopNode.getChildByName("Title").getComponent(cc.Sprite).spriteFrame = this.Atlas.getSpriteFrame("dz_xiaojiesuan5");
            this.TopNode.getChildByName("Title").getChildByName("Title2").getComponent(cc.Sprite).spriteFrame = this.Atlas.getSpriteFrame("dz_xiaojiesuan5");
            this.TopNode.getChildByName("Title").getChildByName("Word").getComponent(cc.Sprite).spriteFrame = this.Atlas.getSpriteFrame("dz_xiaojiesuan6");
        } else {
            this.TopNode.getChildByName("Title").getComponent(cc.Sprite).spriteFrame = this.Atlas.getSpriteFrame("dz_xiaojiesuan3");
            this.TopNode.getChildByName("Title").getChildByName("Title2").getComponent(cc.Sprite).spriteFrame = this.Atlas.getSpriteFrame("dz_xiaojiesuan3");
            this.TopNode.getChildByName("Title").getChildByName("Word").getComponent(cc.Sprite).spriteFrame = this.Atlas.getSpriteFrame("dz_xiaojiesuan4");
        }
    },
    initButtomInfo: function (data) {
        this.TopNode.getChildByName("TimeBG").getChildByName("time").getComponent(cc.Label).string = cc.YL.DDZ_Osdate.LocalTimeString();
        this.ButtomNode.getChildByName("RoomInfo").getChildByName("lun").getComponent(cc.Label).string = "第" + data.currentRound + "局";
        this.ButtomNode.getChildByName("RoomInfo").getChildByName("PassWord").getComponent(cc.Label).string = "房号:" + data.password;
    },
    initItem: function (data) {
        this.MidNode.removeAllChildren();
        for (var i = 0; i < data.usersRoundLotteryInfo.length; i++) {
            var itemNode = cc.instantiate(this.item);
            this.MidNode.addChild(itemNode);
            var headUrl = null;
            var nickName = null;
            if (this.selfID == data.usersRoundLotteryInfo[i].userId) {
                headUrl = cc.YL.DDZselfPlayerInfo.headUrl;
                nickName = cc.YL.DDZselfPlayerInfo.nickName;
            }
            if (data.usersRoundLotteryInfo[i].userId == cc.YL.DDZrightPlayerInfo.userId) {
                headUrl = cc.YL.DDZrightPlayerInfo.headUrl;
                nickName = cc.YL.DDZrightPlayerInfo.nickName;
            }
            if (data.usersRoundLotteryInfo[i].userId == cc.YL.DDZleftPlayerInfo.userId) {
                headUrl = cc.YL.DDZleftPlayerInfo.headUrl;
                nickName = cc.YL.DDZleftPlayerInfo.nickName;
            }
            itemNode.getComponent("DDZ_OneGameOverItem").initItem(data.usersRoundLotteryInfo[i], headUrl,nickName);
        }
    },
    onClickBack: function () {
        this.firstNode.active = true;
        this.node.getChildByName("Second").active = false;
    },

});
