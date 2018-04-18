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
        if (cc.YL.DDZDeskInfo.status <= 2) {
            var UIROOT = cc.find("DDZ_UIROOT");
            UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").initReady(cc.YL.DDZselfPlayerInfo.isReady);// 准备的按钮初始化
        }
        cc.YL.DDZselfPlayerInfo = data;
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
        this.selfNodeComp.hideOffline();
    }
    if (data.retMsg.userId == cc.YL.DDZrightPlayerInfo.userId) {
        this.rightNodeComp.showAndHideReady(data.isReadyOk);
        this.rightNodeComp.hideOffline();
    }
    if (data.retMsg.userId == cc.YL.DDZleftPlayerInfo.userId) {
        this.leftNodeComp.showAndHideReady(data.isReadyOk);
        this.leftNodeComp.hideOffline();
    }
};
DDZGameManager.gameOpen = function (data) {
    //data.currentRound // 当前局数
    //data.second // 倒计时时间
    var UIROOT = cc.find("DDZ_UIROOT");
    UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").updateRoomInfo(data.currentRound);
    cc.YL.info("当前局数", data.currentRound);
    cc.YL.DDZCurrentRound = data.currentRound;
    this.selfNode.getChildByName("Word").active = false;
    this.rightNode.getChildByName("Word").active = false;
    this.leftNode.getChildByName("Word").active = false;
    this.selfNodeComp.updateOutWord(0);
    this.rightNodeComp.updateOutWord(0);
    this.leftNodeComp.updateOutWord(0);
    this.checkPlayerNode();
};
DDZGameManager.handPokerManager = function (data) {
    this.bindNodeValue();
    this.isFaPaiReconnet = data.isReconnect;
    if(data.isReconnect == true){
        if (this.selfID == data.userId) {
            this.selfHandPokerNodeComp.initHandPoker(data.handPokers);
            for (var i = 0; i < data.paiCount.length; i++) {
                cc.YL.info("渲染玩家手牌数和出的牌", data.paiCount[i].userId);
                if (data.paiCount[i].userId == this.selfID) {
                    this.selfOutNodeComp.initOutPoker(data.paiCount[i].outPais,data.paiCount[i].outType);//todo
                }
                if (data.paiCount[i].userId == cc.YL.DDZrightPlayerInfo.userId) {
                    this.rightHandPokerNodeComp.initHandPokerCount(data.paiCount[i].paiCounts);
                    this.rightOutNodeComp.initOutPoker(data.paiCount[i].outPais,data.paiCount[i].outType);//todo

                }
                if (data.paiCount[i].userId == cc.YL.DDZleftPlayerInfo.userId) {
                    this.leftHandPokerNodeComp.initHandPokerCount(data.paiCount[i].paiCounts);
                    this.leftOutNodeComp.initOutPoker(data.paiCount[i].outPais,data.paiCount[i].outType);//todo

                }
            }
            // 找出上一次出的牌，提示用
            var leftOut = [];
            var rightOut = [];
            var rightType= 0;
            var leftType = 0;
            for (var i = 0; i < data.paiCount.length; i++) {
                if (data.paiCount[i].userId == cc.YL.DDZrightPlayerInfo.userId) {
                    rightOut = data.paiCount[i].outPais;
                    rightType = data.paiCount[i].outType;
                }
                if (data.paiCount[i].userId == cc.YL.DDZleftPlayerInfo.userId) {
                    leftOut = data.paiCount[i].outPais;
                    leftType = data.paiCount[i].outType;
                }
            }
            if(leftOut){
                cc.YL.lastOutCardData = {outType:leftType,length:leftOut.length,paiIds:leftOut};
            }else if(rightOut){
                cc.YL.lastOutCardData = {outType:rightType,length:rightOut.length,paiIds:rightOut};
            }
        }
    }else{
        // 不是断线重连，有一个发牌动画
        if (this.selfID == data.userId) {
            this.selfHandPokerNodeComp.initHandPoker(data.handPokers,true);
            var UIROOT = cc.find("DDZ_UIROOT");
            UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showFaPaiAction();
            setTimeout(function(){
                cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPokerTouch").active = true;
                for (var i = 0; i < data.paiCount.length; i++) {
                    if (data.paiCount[i].userId == cc.YL.DDZrightPlayerInfo.userId) {
                        this.rightHandPokerNodeComp.initHandPokerCount(data.paiCount[i].paiCounts);
                    }
                    if (data.paiCount[i].userId == cc.YL.DDZleftPlayerInfo.userId) {
                        this.leftHandPokerNodeComp.initHandPokerCount(data.paiCount[i].paiCounts);
                    }
                }
            }.bind(this),2700);
        }
    }

};
DDZGameManager.startJiaoFen = function (data) {
    // 开始叫分
    var time = 10;
    if(data.retMsg.userId == this.selfID && this.isFaPaiReconnet == false){
        time = 2800;
    }
    setTimeout(function(){
        this.isFaPaiReconnet = true;
        cc.YL.DDZGameAction.startJiaoFen(data);
    }.bind(this), time);
};
DDZGameManager.updateJiaoFen = function (data) {
    cc.YL.DDZGameAction.updateJiaoFen(data);
};
DDZGameManager.startJiaBei = function (data) {
    // 开始加倍
    setTimeout(function () {
        this.isClear = false;
        if(this.isClear == false){
            this.selfNodeComp.updateOutWord(0);
            this.rightNodeComp.updateOutWord(0);
            this.leftNodeComp.updateOutWord(0);
            this.isClear = true;
        }
        cc.YL.DDZGameAction.endJiaoFen();
        cc.YL.DDZGameAction.startJiaBei(data);
    }.bind(this),200);
};
DDZGameManager.updateJiaBei = function (data) {
    cc.YL.DDZGameAction.updateJiaBei(data);
};
DDZGameManager.showDiPai = function (data) {
    if(data.isReconnect == true){
        cc.YL.loaderID = data.diZhuId;
        if (this.selfID == data.diZhuId) {
            this.selfNodeComp.showDiZhuIcon(true);
        }
        if (data.diZhuId == cc.YL.DDZrightPlayerInfo.userId) {
            this.rightNodeComp.showDiZhuIcon(true);
        }
        if (data.diZhuId == cc.YL.DDZleftPlayerInfo.userId) {
            this.leftNodeComp.showDiZhuIcon(true);
        }
        cc.YL.DDZGameAction.showDiPai(data,true);
    }else {
        if (this.selfID == data.diZhuId) {
            cc.YL.DDZAnimation.playDizhu(0);
        }
        if (data.diZhuId == cc.YL.DDZrightPlayerInfo.userId) {
            cc.YL.DDZAnimation.playDizhu(1);
        }
        if (data.diZhuId == cc.YL.DDZleftPlayerInfo.userId) {
            cc.YL.DDZAnimation.playDizhu(2);
        }
        setTimeout(function () {
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
        }.bind(this),1000);
        setTimeout(function () {
            this.bindNodeValue();
            this.selfNodeComp.updateOutWord(0);
            this.rightNodeComp.updateOutWord(0);
            this.leftNodeComp.updateOutWord(0);
            cc.YL.DDZGameAction.endJiaoFen();
        }.bind(this),200);
    }
};
DDZGameManager.showPass = function (data) {
    cc.YL.DDZGameAction.showPass(data);
    this.BtnNode.removeAllChildren();
};
DDZGameManager.playerOutCard = function (data) {
    // 出牌的处理
    // 需要渲染出牌节点，牌剩余张数，玩家自己的手牌
    this.bindNodeValue();
    var playerIndex = -1;
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
        cc.YL.DDZPokerTip.startAnalysis();// 出牌更新玩家当前手牌后，分析手牌
        if(this.selfHandPokerNodeComp.handPokerIDs.length <= 2 && this.selfHandPokerNodeComp.handPokerIDs.length > 0 ){
            cc.YL.DDZAnimation.playWaring(0);
            cc.YL.DDZAudio.playWaring(cc.YL.DDZselfPlayerInfo.userId,this.selfHandPokerNodeComp.handPokerIDs.length);
        }
        playerIndex = 0;
        this.selfNodeComp.hideOffline();
    }
    if (data.retMsg.userId == cc.YL.DDZrightPlayerInfo.userId) {
        this.rightHandPokerNodeComp.initHandPokerCount(data.remainPaiCount);
        this.rightOutNodeComp.initOutPoker(data.paiIds,data.outType);
        if(data.remainPaiCount <= 2 && data.remainPaiCount > 0){
            cc.YL.DDZAnimation.playWaring(1);
            cc.YL.DDZAudio.playWaring(cc.YL.DDZrightPlayerInfo.userId,data.remainPaiCount);
        }
        playerIndex = 1;
        this.rightNodeComp.hideOffline();
    }
    if (data.retMsg.userId == cc.YL.DDZleftPlayerInfo.userId) {
        this.leftHandPokerNodeComp.initHandPokerCount(data.remainPaiCount);
        this.leftOutNodeComp.initOutPoker(data.paiIds,data.outType);
        if(data.remainPaiCount <= 2 && data.remainPaiCount > 0){
            cc.YL.DDZAnimation.playWaring(2);
            cc.YL.DDZAudio.playWaring(cc.YL.DDZleftPlayerInfo.userId,data.remainPaiCount);
        }
        playerIndex = 2;
        this.leftNodeComp.hideOffline();
    }
    cc.YL.DDZAnimation.playAnimationByType(playerIndex,data.outType);

};
DDZGameManager.overTurn = function (data) {
    cc.YL.DDZGameAction.endJiaoFen();
    cc.YL.DDZGameAction.endJiaBei();
    cc.YL.DDZGameAction.overTurn(data);
};
DDZGameManager.showOneGameOver = function (data) {
    setTimeout(function () {
        this.isClear = false;
        this.selfNodeComp.updateOutWord(0);
        this.rightNodeComp.updateOutWord(0);
        this.leftNodeComp.updateOutWord(0);
        this.selfNodeComp.showHeadAnimation(false);
        this.rightNodeComp.showHeadAnimation(false);
        this.leftNodeComp.showHeadAnimation(false);
        var UIROOT = cc.find("DDZ_UIROOT");
        UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showOneGameOver(data);
    }.bind(this),700);
};
DDZGameManager.showAllGameOver = function (data) {
    cc.YL.info("是否是中途解散",data.isNormalEnd);
    this.isClear = false;
    this.selfNodeComp.showHeadAnimation(false);
    this.rightNodeComp.showHeadAnimation(false);
    this.leftNodeComp.showHeadAnimation(false);
    if(data.isNormalEnd == false){
        var UIROOT = cc.find("DDZ_UIROOT");
        UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showAllGameOver(data);
    }else{
        cc.YL.DDZAllGameOverData = data;
    }

};
DDZGameManager.playerLeave = function(data){
    this.bindNodeValue();
    if (this.selfID == data.retMsg.userId) {
        cc.YL.DDZselfPlayerInfo = null;
        cc.YL.DDZrightPlayerInfo = null;
        cc.YL.DDZleftPlayerInfo = null;
        if(cc.YL.DDZDeskInfo.owner != fun.db.getData('UserInfo').UserId){
            cc.director.loadScene("hall");
        }
    }
    if(cc.YL.DDZrightPlayerInfo){
        if (data.retMsg.userId == cc.YL.DDZrightPlayerInfo.userId) {
            cc.YL.DDZrightPlayerInfo = null;
            this.rightNodeComp.clearNodeUI();
            this.rightNode.active = false;
            this.rightHandPokerNodeComp.cleanHandPokerCount();
            this.rightOutNodeComp.clearOutPoker();
        }
    }
    if(cc.YL.DDZleftPlayerInfo){
        if (data.retMsg.userId == cc.YL.DDZleftPlayerInfo.userId) {
            cc.YL.DDZleftPlayerInfo = null;
            this.leftNodeComp.clearNodeUI();
            this.leftNode.active = false;
            this.leftHandPokerNodeComp.cleanHandPokerCount();
            this.leftOutNodeComp.clearOutPoker();
        }
    }

};
DDZGameManager.PID_BREAK = function(data){
    this.bindNodeValue();
    if (this.selfID == data.retMsg.userId) {
        this.selfNodeComp.showOffline();
    }
    if(cc.YL.DDZrightPlayerInfo){
        if (data.retMsg.userId == cc.YL.DDZrightPlayerInfo.userId) {
            this.rightNodeComp.showOffline();
        }
    }
    if(cc.YL.DDZleftPlayerInfo){
        if (data.retMsg.userId == cc.YL.DDZleftPlayerInfo.userId) {
            this.leftNodeComp.showOffline();
        }
    }
};
DDZGameManager.checkPlayerNode = function(){
    if(this.selfNode.active == false
    || this.rightNode.active == false
    || this.leftNode.active == false){
        fun.net.send("PID_LOGINSERVER_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
        });
        cc.YL.err("玩家节点显示不完整，断线重连一波");
    }
};
module.exports = DDZGameManager;
cc.YL.DDZGameManager = DDZGameManager;