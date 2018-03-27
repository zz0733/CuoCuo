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
    } else {
        if (this.selfNodeComp.playerInfo.index == 2) {
            if (data.index == 3) {
                this.rightNodeComp.initRightPlayerNode(data);
            } else if (data.index == 1) {
                this.leftNodeComp.initLeftPlayerNode(data);
            }
        } else if (this.selfNodeComp.playerInfo.index == 1) {
            if (data.index == 2) {
                this.rightNodeComp.initRightPlayerNode(data);
            } else if (data.index == 3) {
                this.leftNodeComp.initLeftPlayerNode(data);
            }
        } else if (this.selfNodeComp.playerInfo.index == 3) {
            if (data.index == 1) {
                this.rightNodeComp.initRightPlayerNode(data);
            } else if (data.index == 2) {
                this.leftNodeComp.initLeftPlayerNode(data);
            }
        }
    }
};
DDZGameManager.updateReady = function (data) {
    this.bindNodeValue();
    if (this.selfID == data.userId) {
        this.selfNodeComp.showAndHideReady(data.isReadyOk);
    } else if (data.userId == this.rightNodeComp.playerInfo.userId) {
        this.rightNodeComp.showAndHideReady(data.isReadyOk);
    } else if (data.userId == this.leftNodeComp.playerInfo.userId) {
        this.leftNodeComp.showAndHideReady(data.isReadyOk);
    }
};
DDZGameManager.gameOpen = function (data) {
    //data.currentRound // 当前局数
    //data.second // 倒计时时间
    var UIROOT = cc.find("DDZ_UIROOT");
    UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").updateRoomInfo(data.currentRound);
};
DDZGameManager.handPokerManager = function (data) {
    this.bindNodeValue();
    if (this.selfID == data.userId) {
        this.selfHandPokerNodeComp.initHandPoker(data.handPokers);
        this.selfOutNodeComp.initOutPoker(data.paiCount.outPais);
    } else if (data.userId == this.rightNodeComp.playerInfo.userId) {
        this.rightHandPokerNodeComp.initHandPokerCount(data.paiCount.paiCounts);
        this.rightOutNodeComp.initOutPoker(data.paiCount.outPais);
    } else if (data.userId == this.leftNodeComp.playerInfo.userId) {
        this.leftHandPokerNodeComp.initHandPokerCount(data.paiCount.paiCounts);
        this.leftOutNodeComp.initOutPoker(data.paiCount.outPais);
    }
};
DDZGameManager.startJiaoFen = function (data) {
    // 开始叫分
    cc.YL.DDZGameAction.startJiaoFen(data);
};
DDZGameManager.updateJiaoFen = function (data) {
    cc.YL.DDZGameAction.updateJiaoFen(data);
};
DDZGameManager.startJiaBei = function (data) {
    // 开始叫分
    cc.YL.DDZGameAction.endJiaoFen();
    cc.YL.DDZGameAction.startJiaBei(data);
};
DDZGameManager.updateJiaBei = function (data) {
    cc.YL.DDZGameAction.updateJiaBei(data);
};
DDZGameManager.showDiPai = function (data) {
    this.bindNodeValue();
    if (this.selfID == data.diZhuId) {
        this.selfNodeComp.showDiZhuIcon(true);
    } else if (data.diZhuId == this.rightNodeComp.playerInfo.userId) {
        this.rightNodeComp.showDiZhuIcon(true);
    } else if (data.diZhuId == this.leftNodeComp.playerInfo.userId) {
        this.leftNodeComp.showDiZhuIcon(true);
    }
    cc.YL.DDZGameAction.showDiPai(data);
};
DDZGameManager.showPass = function (data) {
    cc.YL.DDZGameAction.showPass();
};
DDZGameManager.playerOutCard = function (data) {
    // 出牌的处理
    // 需要渲染出牌节点，牌剩余张数，玩家自己的手牌
    this.bindNodeValue();
    if (this.selfID == data.userId) {
        for (var j = 0; j < data.paiIds.length; j++) {
            for (var i = 0; i < this.selfHandPokerNodeComp.handPokerIDs.length; i++) {
                if (data.paiIds[j] == this.selfHandPokerNodeComp.handPokerIDs[i]) {
                    this.selfHandPokerNodeComp.handPokerIDs.splice(i, 1);
                    break;
                }
            }
        }
        this.selfHandPokerNodeComp.initHandPoker(this.selfHandPokerNodeComp.handPokerIDs);
        this.selfOutNodeComp.initOutPoker(data.paiIds);
        cc.YL.PokerTip.startAnalysis();// 出牌更新玩家当前手牌后，分析手牌
    } else if (data.userId == this.rightNodeComp.playerInfo.userId) {
        this.rightHandPokerNodeComp.initHandPokerCount(this.rightHandPokerNodeComp.cardNum - data.paiIds.length);
        this.rightOutNodeComp.initOutPoker(data.paiIds);
    } else if (data.userId == this.leftNodeComp.playerInfo.userId) {
        this.leftHandPokerNodeComp.initHandPokerCount(this.leftHandPokerNodeComp.cardNum - data.paiIds.length);
        this.leftOutNodeComp.initOutPoker(data.paiIds);
    }
};
DDZGameManager.overTurn = function (data) {
    cc.YL.DDZGameAction.overTurn(data);
};
DDZGameManager.showOneGameOver = function (data) {
    cc.YL.DDZGameAction.showOneGameOver(data);
};
DDZGameManager.showAllGameOver = function (data) {
    cc.YL.DDZGameAction.showAllGameOver(data);
};
module.exports = DDZGameManager;
cc.YL.DDZGameManager = DDZGameManager;