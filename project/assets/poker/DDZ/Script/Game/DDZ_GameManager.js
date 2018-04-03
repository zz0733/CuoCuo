/********
 * 房间渲染相关
 * *********/

var DDZGameManager = cc.Class({});
DDZGameManager.bindNodeValue = function () {
    this.selfID = fun.db.getData('UserInfo').UserId;
    this.selfNode = cc.find("DDZ_UIROOT/MainNode/SelfPlayerInfo");
    this.rightNode = cc.find("DDZ_UIROOT/MainNode/RightPlayerInfo");
    this.leftNode = cc.find("DDZ_UIROOT/MainNode/LeftPlayerInfo");
    this.selfActiveNode = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker");
    this.rightActiveNode = cc.find("DDZ_UIROOT/MainNode/RightPlayerPoker");
    this.leftActiveNode = cc.find("DDZ_UIROOT/MainNode/LeftPlayerPoker");
    this.selfHandPokerNode = this.selfActiveNode.getChildByName("HandPoker");
    this.rightHandPokerNode = this.rightActiveNode.getChildByName("HandPoker");
    this.leftHandPokerNode = this.leftActiveNode.getChildByName("HandPoker");
    this.selfOutNode = this.selfActiveNode.getChildByName("OutPoker");
    this.rightOutNode = this.rightActiveNode.getChildByName("OutPoker");
    this.leftOutNode = this.leftActiveNode.getChildByName("OutPoker");
    this.selfOutNodeComp = this.selfOutNode.getComponent("DDZ_PlayerSelfOutPoker");
    this.rightOutNodeComp = this.rightOutNode.getComponent("DDZ_PlayerRightOutPoker");
    this.leftOutNodeComp = this.leftOutNode.getComponent("DDZ_PlayerLeftOutPoker");
    this.selfHandPokerNodeComp = this.selfHandPokerNode.getComponent("DDZ_PlayerSelfPoker");
    this.rightHandPokerNodeComp = this.rightHandPokerNode.getComponent("DDZ_PlayerRightPoker");
    this.leftHandPokerNodeComp = this.leftHandPokerNode.getComponent("DDZ_PlayerLeftPoker");
    this.selfNodeComp = this.selfNode.getComponent("DDZ_PlayerSelfInfo");
    this.rightNodeComp = this.rightNode.getComponent("DDZ_PlayerRightInfo");
    this.leftNodeComp = this.leftNode.getComponent("DDZ_PlayerLeftInfo");
    this.BtnNode = cc.find("DDZ_UIROOT/MainNode/PlayerBtnNode");
};
DDZGameManager.LoadScene = function (str) {
    // 跳转场景
    cc.director.loadScene(str);
};
DDZGameManager.initDeskByData = function (data) {
    //牌桌Info
    var UIROOT = cc.find("DDZ_UIROOT");
    UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").initDeskUI(data);
};
DDZGameManager.initPlayerNode = function (data) {
    // 玩家信息
    this.bindNodeValue();
    if (this.selfID == data.userId) {
        // 玩家自己的消息信息
        this.selfNodeComp.initSelfPlayerNode(data);
        cc.YL.DDZselfPlayerInfo = data;
        cc.YL.info("现在的playerinfo",cc.YL.DDZrightPlayerInfo,cc.YL.DDZleftPlayerInfo);
        if(!cc.YL.DDZrightPlayerInfo){
            cc.YL.DDZrightPlayerInfo = {
                userId: 0,
            };
        }
        if(!cc.YL.DDZleftPlayerInfo){
            cc.YL.DDZleftPlayerInfo = {
                userId: 0,
            };
        }
    } else {

        if (cc.YL.selfIndex == 1) {
            if (data.index == 2) {
                this.rightNodeComp.initRightPlayerNode(data);
                cc.YL.DDZrightPlayerInfo = data;
            } else if (data.index == 0) {
                this.leftNodeComp.initLeftPlayerNode(data);
                cc.YL.DDZleftPlayerInfo = data;
            }
        }
        if (cc.YL.selfIndex == 0) {
            if (data.index == 1) {
                this.rightNodeComp.initRightPlayerNode(data);
                cc.YL.DDZrightPlayerInfo = data;
            } else if (data.index == 2) {
                this.leftNodeComp.initLeftPlayerNode(data);
                cc.YL.DDZleftPlayerInfo = data;
            }
        }
        if (cc.YL.selfIndex == 2) {
            if (data.index == 0) {
                this.rightNodeComp.initRightPlayerNode(data);
                cc.YL.DDZrightPlayerInfo = data;
            } else if (data.index == 1) {
                this.leftNodeComp.initLeftPlayerNode(data);
                cc.YL.DDZleftPlayerInfo = data;
            }
        }
    }
};
DDZGameManager.updateReady = function (data) {
    this.bindNodeValue();
    if (this.selfID == data.retMsg.userId) {
        this.selfNodeComp.showAndHideReady(data.isReadyOk);
    }
    if (data.retMsg.userId == cc.YL.DDZrightPlayerInfo.userId) {
        this.rightNodeComp.showAndHideReady(data.isReadyOk);
    }
    if (data.retMsg.userId == cc.YL.DDZleftPlayerInfo.userId) {
        this.leftNodeComp.showAndHideReady(data.isReadyOk);
    }
};
DDZGameManager.gameOpen = function (data) {
    //data.currentRound // 当前局数
    //data.second // 倒计时时间
    var UIROOT = cc.find("DDZ_UIROOT");
    UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").updateRoomInfo(data.currentRound);
    cc.YL.info("当前局数", data.currentRound);
    this.selfNode.getChildByName("Word").getComponent(cc.Label).string = "";
    this.rightNode.getChildByName("Word").getComponent(cc.Label).string = "";
    this.leftNode.getChildByName("Word").getComponent(cc.Label).string = "";
};
DDZGameManager.handPokerManager = function (data) {
    this.bindNodeValue();
    if (this.selfID == data.userId) {
        this.selfHandPokerNodeComp.initHandPoker(data.handPokers);
        for (var i = 0; i < data.paiCount.length; i++) {
            cc.YL.info("渲染玩家手牌数和出的牌", data.paiCount[i].userId);
            if (data.paiCount[i].userId == this.selfID) {
                this.selfOutNodeComp.initOutPoker(data.paiCount.outPais);
                //todo
            }
            if (data.paiCount[i].userId == cc.YL.DDZrightPlayerInfo.userId) {
                this.rightHandPokerNodeComp.initHandPokerCount(data.paiCount[i].paiCounts);
                this.rightOutNodeComp.initOutPoker(data.paiCount[i].outPais);
                //todo
            }
            if (data.paiCount[i].userId == cc.YL.DDZleftPlayerInfo.userId) {
                this.leftHandPokerNodeComp.initHandPokerCount(data.paiCount[i].paiCounts);
                this.leftOutNodeComp.initOutPoker(data.paiCount[i].outPais);
                //todo
            }
        }
    }
};
DDZGameManager.startJiaoFen = function (data) {
    // 开始叫分
    cc.YL.DDZGameAction.startJiaoFen(data);
    this.selfNodeComp.updateOutWord(0);
    this.rightNodeComp.updateOutWord(0);
    this.leftNodeComp.updateOutWord(0);
};
DDZGameManager.updateJiaoFen = function (data) {
    cc.YL.DDZGameAction.updateJiaoFen(data);
};
DDZGameManager.startJiaBei = function (data) {
    // 开始加倍
    this.selfNodeComp.updateOutWord(0);
    this.rightNodeComp.updateOutWord(0);
    this.leftNodeComp.updateOutWord(0);
    cc.YL.DDZGameAction.endJiaoFen();
    cc.YL.DDZGameAction.startJiaBei(data);
};
DDZGameManager.updateJiaBei = function (data) {
    cc.YL.DDZGameAction.updateJiaBei(data);
};
DDZGameManager.showDiPai = function (data) {
    this.bindNodeValue();
    cc.YL.DDZGameAction.endJiaoFen();
    cc.YL.loaderID = data.diZhuId;
    if (this.selfID == data.diZhuId) {
        cc.YL.warn("玩家自己是地主");
        this.selfNodeComp.showDiZhuIcon(true);
        var oldCard = this.selfHandPokerNodeComp.handPokerIDs;
        for (var i = 0; i < data.diPais.length; i++) {
            oldCard.push(data.diPais[i]);
        }
        this.selfHandPokerNodeComp.initHandPoker(oldCard);
    }
    if (data.diZhuId == cc.YL.DDZrightPlayerInfo.userId) {
        cc.YL.warn("右边是地主");
        this.rightNodeComp.showDiZhuIcon(true);
        this.rightHandPokerNodeComp.initHandPokerCount(this.rightHandPokerNodeComp.cardNum + 3);
    }
    if (data.diZhuId == cc.YL.DDZleftPlayerInfo.userId) {
        cc.YL.warn("左边是地主");
        this.leftNodeComp.showDiZhuIcon(true);
        this.leftHandPokerNodeComp.initHandPokerCount(this.leftHandPokerNodeComp.cardNum + 3);
    }
    cc.YL.DDZGameAction.showDiPai(data);
};
DDZGameManager.showPass = function (data) {
    cc.YL.DDZGameAction.showPass(data);
    this.BtnNode.removeAllChildren();
};
DDZGameManager.playerOutCard = function (data) {
    // 出牌的处理
    // 需要渲染出牌节点，牌剩余张数，玩家自己的手牌
    this.bindNodeValue();

    if (this.selfID == data.retMsg.userId) {
        this.BtnNode.removeAllChildren();
        for (var j = 0; j < data.paiIds.length; j++) {
            for (var i = 0; i < this.selfHandPokerNodeComp.handPokerIDs.length; i++) {
                if (data.paiIds[j] == this.selfHandPokerNodeComp.handPokerIDs[i]) {
                    cc.YL.info("删除自己手牌是：",this.selfHandPokerNodeComp.handPokerIDs[i]);
                    this.selfHandPokerNodeComp.handPokerIDs.splice(i, 1);
                    break;
                }
            }
        }
        this.selfHandPokerNodeComp.initHandPoker(this.selfHandPokerNodeComp.handPokerIDs);
        this.selfOutNodeComp.initOutPoker(data.paiIds,data.outType);
        cc.YL.PokerTip.startAnalysis();// 出牌更新玩家当前手牌后，分析手牌
    }
    if (data.retMsg.userId == cc.YL.DDZrightPlayerInfo.userId) {
        this.rightHandPokerNodeComp.initHandPokerCount(data.remainPaiCount);
        this.rightOutNodeComp.initOutPoker(data.paiIds,data.outType);
    }
    if (data.retMsg.userId == cc.YL.DDZleftPlayerInfo.userId) {
        this.leftHandPokerNodeComp.initHandPokerCount(data.remainPaiCount);
        this.leftOutNodeComp.initOutPoker(data.paiIds,data.outType);
    }
};
DDZGameManager.overTurn = function (data) {
    this.selfNodeComp.updateOutWord(0);
    this.rightNodeComp.updateOutWord(0);
    this.leftNodeComp.updateOutWord(0);
    cc.YL.DDZGameAction.endJiaoFen();
    cc.YL.DDZGameAction.endJiaBei();
    cc.YL.DDZGameAction.overTurn(data);
};
DDZGameManager.showOneGameOver = function (data) {
    var UIROOT = cc.find("DDZ_UIROOT");
    UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showOneGameOver(data);

};
DDZGameManager.showAllGameOver = function (data) {
    var UIROOT = cc.find("DDZ_UIROOT");
    UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showAllGameOver(data);
};
module.exports = DDZGameManager;
cc.YL.DDZGameManager = DDZGameManager;