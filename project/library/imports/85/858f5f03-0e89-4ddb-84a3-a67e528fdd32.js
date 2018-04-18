"use strict";
cc._RF.push(module, '858f58DDolN24Sjpn5Sj90y', 'DDZ_OneGameOver');
// poker/DDZ/Script/Gameover/DDZ_OneGameOver.js

"use strict";

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
        Atlas: cc.SpriteAtlas
    },

    start: function start() {
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

    initNodeForSimple: function initNodeForSimple(data, isRePlay) {
        this._isRepaly = isRePlay;
        if (isRePlay == true) {
            this.initFirstUI(data, isRePlay);
            // this.node.getComponent(cc.Sprite).spriteFrame = null;
        } else {
            if (data.isSpring || data.isReverseSpring) {
                cc.YL.DDZAnimation.playSpring(data.isSpring, data.isReverseSpring);
            }
            setTimeout(function () {
                this.initFirstUI(data, isRePlay);
            }.bind(this), data.isSpring == true || data.isReverseSpring == true ? 1500 : 10);
        }
    },
    initFirstUI: function initFirstUI(data, isRePlay) {
        this.selfID = fun.db.getData('UserInfo').UserId;
        this.firstNode = this.node.getChildByName("First");
        this.firstNode.active = true;
        this.node.getChildByName("Second").active = false;
        this.selfNode = this.firstNode.getChildByName("Self");
        this.rightNode = this.firstNode.getChildByName("Right");
        this.leftNode = this.firstNode.getChildByName("Left");
        this.oneGameOverData = data;
        for (var i = 0; i < data.usersRoundLotteryInfo.length; i++) {
            if (this.selfID == data.usersRoundLotteryInfo[i].userId) {
                this.initSelf(data.usersRoundLotteryInfo[i]);
                var selfInfo = data.usersRoundLotteryInfo[i];
                this.isWin = data.usersRoundLotteryInfo[i].score >= 0 ? true : false;
                var selfScore = data.usersRoundLotteryInfo[i].score;
            }
            if (data.usersRoundLotteryInfo[i].userId == cc.YL.DDZrightPlayerInfo.userId) {
                this.initRight(data.usersRoundLotteryInfo[i]);
                var rightScore = data.usersRoundLotteryInfo[i].score;
            }
            if (data.usersRoundLotteryInfo[i].userId == cc.YL.DDZleftPlayerInfo.userId) {
                this.initLeft(data.usersRoundLotteryInfo[i]);
                var leftScore = data.usersRoundLotteryInfo[i].score;
            }
        }
        if (selfScore == 0 && rightScore == 0 && leftScore == 0) {
            if (isRePlay == true) {
                this.firstNode.getChildByName("Continue").active = false;
                this.firstNode.getChildByName("Leave").active = true;
            } else {
                this.firstNode.getChildByName("ShowWinOrLose").active = false;
            }
        } else {
            if (isRePlay == true) {
                this.firstNode.getChildByName("Continue").active = false;
                this.firstNode.getChildByName("Leave").active = true;
            } else {
                this.initIcon(selfInfo);
            }
        }
    },
    _sortPokerArrObj: function _sortPokerArrObj(arr) {
        return arr.sort(function (a, b) {
            return a.Num - b.Num;
        });
    },
    initSelf: function initSelf(data) {
        var list = data.remainPokers;
        var infoNode = this.firstNode.getChildByName("SelfPlayerInfo");
        var headUrl = cc.YL.DDZselfPlayerInfo.headUrl;
        var nickName = cc.YL.DDZselfPlayerInfo.nickName;
        fun.utils.loadUrlRes(headUrl, infoNode.getChildByName("HeadNode")); // 头像
        infoNode.getChildByName("NickNameBG").getChildByName("Name").getComponent(cc.Label).string = nickName;
        infoNode.getChildByName("CoinBG").getChildByName("Num").getComponent(cc.Label).string = data.totalScore;
        infoNode.getChildByName("ID").getComponent(cc.Label).string = data.userId;
        if (list) {
            var temp = [];
            for (var i = 0; i < list.length; i++) {
                var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(list[i]);
                temp.push(pokerObj);
            }
            temp = this._sortPokerArrObj(temp);
            temp.reverse();
            var startPosX = (temp.length - 1) * -25;
            for (var i = 0; i < temp.length; i++) {
                var pokerNode = this.initPoker(temp[i]);
                this.selfNode.getChildByName("Poker").addChild(pokerNode);
                var posX = startPosX + i * 50;
                pokerNode.setPosition(posX, 0);
                pokerNode.setTag(posX);
            }
        }

        data.score >= 0 ? this.selfNode.getChildByName("Num").getComponent(cc.Label).string = "+" + data.score : this.selfNode.getChildByName("Num").getComponent(cc.Label).string = data.score;
        data.score >= 0 ? this.selfNode.getChildByName("Num_lose").getComponent(cc.Label).string = "+" + data.score : this.selfNode.getChildByName("Num_lose").getComponent(cc.Label).string = data.score;
        if (data.score >= 0) {
            this.selfNode.getChildByName("Num_lose").active = false;
        } else {
            this.selfNode.getChildByName("Num").active = false;
        }
        if (data.isDiZhu == true) {
            this.node.getChildByName("First").getChildByName("SelfPlayerInfo").getChildByName("DiZhu").active = true;
        }
    },

    initRight: function initRight(data) {
        var list = data.remainPokers;
        var infoNode = this.firstNode.getChildByName("RightPlayerInfo");
        var headUrl = cc.YL.DDZrightPlayerInfo.headUrl;
        var nickName = cc.YL.DDZrightPlayerInfo.nickName;
        fun.utils.loadUrlRes(headUrl, infoNode.getChildByName("HeadNode")); // 头像
        infoNode.getChildByName("NickNameBG").getChildByName("Name").getComponent(cc.Label).string = nickName;
        infoNode.getChildByName("NickNameBG").getChildByName("Num").getComponent(cc.Label).string = data.totalScore;
        infoNode.getChildByName("ID").getComponent(cc.Label).string = data.userId;
        if (list) {
            var temp = [];
            for (var i = 0; i < list.length; i++) {
                var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(list[i]);
                temp.push(pokerObj);
            }
            temp = this._sortPokerArrObj(temp);
            temp = temp.reverse();
            for (var i = 0; i < temp.length; i++) {
                var pokerNode = this.initPoker(temp[i]);
                if (i > 10) {
                    var posX = -500 + (i - 11) * 50;
                    pokerNode.setPosition(posX, -100);
                    // pokerNode.zIndex = 50 - i;
                } else {
                    var posX = -500 + i * 50;
                    pokerNode.setPosition(posX, 0);
                    // pokerNode.zIndex = list.length - i;
                }
                this.rightNode.getChildByName("Poker").addChild(pokerNode);
                pokerNode.setTag(posX);
            }
        }
        data.score >= 0 ? this.rightNode.getChildByName("Num").getComponent(cc.Label).string = "+" + data.score : this.rightNode.getChildByName("Num").getComponent(cc.Label).string = data.score;
        data.score >= 0 ? this.rightNode.getChildByName("Num_lose").getComponent(cc.Label).string = "+" + data.score : this.rightNode.getChildByName("Num_lose").getComponent(cc.Label).string = data.score;
        if (data.score >= 0) {
            this.rightNode.getChildByName("Num_lose").active = false;
        } else {
            this.rightNode.getChildByName("Num").active = false;
        }
        if (data.isDiZhu == true) {
            this.node.getChildByName("First").getChildByName("RightPlayerInfo").getChildByName("DiZhu").active = true;
        }
    },

    initLeft: function initLeft(data) {
        var list = data.remainPokers;
        var infoNode = this.firstNode.getChildByName("LeftPlayerInfo");
        var headUrl = cc.YL.DDZleftPlayerInfo.headUrl;
        var nickName = cc.YL.DDZleftPlayerInfo.nickName;
        fun.utils.loadUrlRes(headUrl, infoNode.getChildByName("HeadNode")); // 头像
        infoNode.getChildByName("NickNameBG").getChildByName("Name").getComponent(cc.Label).string = nickName;
        infoNode.getChildByName("NickNameBG").getChildByName("Num").getComponent(cc.Label).string = data.totalScore;
        infoNode.getChildByName("ID").getComponent(cc.Label).string = data.userId;
        if (list) {
            var temp = [];
            for (var i = 0; i < list.length; i++) {
                var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(list[i]);
                temp.push(pokerObj);
            }
            temp = this._sortPokerArrObj(temp);
            temp.reverse();
            for (var i = 0; i < temp.length; i++) {
                var pokerNode = this.initPoker(temp[i]);
                this.leftNode.getChildByName("Poker").addChild(pokerNode);
                if (i > 10) {
                    var posX = (i - 11) * 50;
                    pokerNode.setPosition(posX, -100);
                } else {
                    var posX = i * 50;
                    pokerNode.setPosition(posX, 0);
                }
                pokerNode.setTag(posX);
            }
        }
        data.score >= 0 ? this.leftNode.getChildByName("Num").getComponent(cc.Label).string = "+" + data.score : this.leftNode.getChildByName("Num").getComponent(cc.Label).string = data.score;
        data.score >= 0 ? this.leftNode.getChildByName("Num_lose").getComponent(cc.Label).string = "+" + data.score : this.leftNode.getChildByName("Num_lose").getComponent(cc.Label).string = data.score;
        if (data.score >= 0) {
            this.leftNode.getChildByName("Num_lose").active = false;
        } else {
            this.leftNode.getChildByName("Num").active = false;
        }
        if (data.isDiZhu == true) {
            this.node.getChildByName("First").getChildByName("LeftPlayerInfo").getChildByName("DiZhu").active = true;
        }
    },

    onClickContinue: function onClickContinue() {
        cc.YL.DDZAudio.playBtnClick();
        if (cc.YL.DDZAllGameOverData) {
            var UIROOT = cc.find("DDZ_UIROOT");
            UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showAllGameOver(cc.YL.DDZAllGameOverData);
        } else {
            fun.net.send("PID_READY_REQ", {
                userId: fun.db.getData('UserInfo').UserId
            });
        }
        this.node.active = false;
        this.node.destroy();
    },
    onClickDetail: function onClickDetail() {
        cc.YL.DDZAudio.playBtnClick();
        this.firstNode.active = false;
        this.node.getChildByName("Second").active = true;
        this.initSecondUI(this.oneGameOverData);
    },
    onClickLeave: function onClickLeave(event) {
        cc.director.loadScene("hall");
        event.target.active = false;
    },
    initPoker: function initPoker(pokerObj) {

        var newNode = cc.instantiate(this.pokerPre);
        newNode.getComponent("DDZ_Poker").initPoker(pokerObj);
        return newNode;
    },
    initIcon: function initIcon(data) {

        this.firstNode.getChildByName("ShowWinOrLose").active = true;
        var isShow = false;
        for (var i = 0; i < this.firstNode.getChildByName("ShowWinOrLose").children.length; i++) {
            this.firstNode.getChildByName("ShowWinOrLose").children[i].active = false;
        }
        if (isShow == true) {
            return;
        }
        if (data.isDiZhu == true) {
            data.isWinner == true ? this.firstNode.getChildByName("ShowWinOrLose").getChildByName("1").active = true : this.firstNode.getChildByName("ShowWinOrLose").getChildByName("2").active = true;
        } else {
            data.isWinner == true ? this.firstNode.getChildByName("ShowWinOrLose").getChildByName("3").active = true : this.firstNode.getChildByName("ShowWinOrLose").getChildByName("4").active = true;
        }
        this.firstNode.getChildByName("ShowWinOrLose").stopAllActions();
        this.firstNode.getChildByName("ShowWinOrLose").setScale(0);
        this.firstNode.getChildByName("ShowWinOrLose").runAction(cc.scaleTo(0.9, 1.2).easing(cc.easeBackOut()));
        setTimeout(function () {
            this.firstNode.getChildByName("ShowWinOrLose").active = false;
            isShow = true;
        }.bind(this), 2000);
    },
    /***********************************第一个界面***************************************/

    /***********************************第二个界面***************************************/
    initSecondUI: function initSecondUI(data) {
        this.ButtomNode = this.node.getChildByName("Second").getChildByName("Buttom");
        this.MidNode = this.node.getChildByName("Second").getChildByName("Mid");
        this.TopNode = this.node.getChildByName("Second").getChildByName("Top");
        this.initTitle();
        this.initButtomInfo(data);
        this.initItem(data);
    },
    initTitle: function initTitle() {
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
    initButtomInfo: function initButtomInfo(data) {
        if (this._isRepaly == true) {
            this.TopNode.getChildByName("TimeBG").active = false;
        } else {
            this.TopNode.getChildByName("TimeBG").getChildByName("time").getComponent(cc.Label).string = cc.YL.DDZ_Osdate.LocalTimeString();
        }
        this.ButtomNode.getChildByName("RoomInfo").getChildByName("lun").getComponent(cc.Label).string = "第" + data.currentRound + "局";
        this.ButtomNode.getChildByName("RoomInfo").getChildByName("PassWord").getComponent(cc.Label).string = "房号:" + data.password;
    },
    initItem: function initItem(data) {
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
            itemNode.getComponent("DDZ_OneGameOverItem").initItem(data.usersRoundLotteryInfo[i], headUrl, nickName, this.oneGameOverData.diFen);
        }
    },
    onClickBack: function onClickBack() {
        this.firstNode.active = true;
        this.node.getChildByName("Second").active = false;
    }

});

cc._RF.pop();