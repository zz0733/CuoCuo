"use strict";
cc._RF.push(module, '19708J95zBDuZEQBeyUaw5y', 'DDZ_GameAction');
// poker/DDZ/Script/Game/DDZ_GameAction.js

"use strict";

/*************
 * 游戏内操作的所有处理
 * 只是玩家自己的按钮事件
 * 这些操作之后的渲染工作都在Player目录下对应玩家js
 * 包含有叫分
 * 加倍
 * 出牌
 * 过牌等
 * *********/
var GameAction = cc.Class({});
GameAction.bindNodeName = function () {
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

GameAction.startJiaoFen = function (data) {
    // 开始叫分的操作
    // 初始化叫分的预制
    //广播
    this.bindNodeName();
    this.BtnNode.removeAllChildren();
    this.selfNodeComp.showHeadAnimation(false);
    this.rightNodeComp.showHeadAnimation(false);
    this.leftNodeComp.showHeadAnimation(false);
    if (data.retMsg.userId == this.selfID) {
        this.selfNodeComp.showHeadAnimation(true);
        var jiaoFenPre = this.BtnNode.getComponent("DDZ_PlayerBtn").JiaoFen;
        var jiaoFenNode = this.BtnNode.getChildByName("DDZ_JiaoFen") ? this.BtnNode.getChildByName("DDZ_JiaoFen") : cc.instantiate(jiaoFenPre);
        this.BtnNode.getChildByName("DDZ_JiaoFen") ? this.BtnNode.getChildByName("DDZ_JiaoFen").active = true : this.BtnNode.addChild(jiaoFenNode);
        jiaoFenNode.getComponent("DDZ_JiaoFen").initJIaoFenUI(data);
    }
    if (data.retMsg.userId == cc.YL.DDZrightPlayerInfo.userId) {
        this.rightNodeComp.showHeadAnimation(true);
    }
    if (data.retMsg.userId == cc.YL.DDZleftPlayerInfo.userId) {
        this.leftNodeComp.showHeadAnimation(true);
    }
};
GameAction.updateJiaoFen = function (data) {
    // 更新叫分的操作ack
    this.bindNodeName();
    if (this.selfID == data.retMsg.userId) {
        if (this.BtnNode.getChildByName("DDZ_JiaoFen")) {
            this.BtnNode.getChildByName("DDZ_JiaoFen").active = false;
            this.BtnNode.getChildByName("DDZ_JiaoFen").destroy();
        }
        data.fen != 0 ? this.selfNodeComp.updateOutWord(parseInt(data.fen + 3)) : this.selfNodeComp.updateOutWord(3);
        this.selfNodeComp.hideOffline();
    }
    if (data.retMsg.userId == cc.YL.DDZrightPlayerInfo.userId) {
        data.fen != 0 ? this.rightNodeComp.updateOutWord(parseInt(data.fen + 3)) : this.rightNodeComp.updateOutWord(3);
        this.rightNodeComp.hideOffline();
    }
    if (data.retMsg.userId == cc.YL.DDZleftPlayerInfo.userId) {
        data.fen != 0 ? this.leftNodeComp.updateOutWord(parseInt(data.fen + 3)) : this.leftNodeComp.updateOutWord(3);
        this.leftNodeComp.hideOffline();
    }
};
GameAction.endJiaoFen = function () {
    // 结束叫分的操作
    this.bindNodeName();
    if (this.BtnNode.getChildByName("DDZ_JiaoFen")) {
        this.BtnNode.getChildByName("DDZ_JiaoFen").active = false;
        this.BtnNode.getChildByName("DDZ_JiaoFen").destroy();
    }
};
GameAction.startJiaBei = function (data) {
    // 开始加倍的操作
    // 初始化加倍的预制
    this.bindNodeName();
    this.selfNodeComp.showHeadAnimation(false);
    this.rightNodeComp.showHeadAnimation(false);
    this.leftNodeComp.showHeadAnimation(false);
    if (data.retMsg.userId = this.selfID) {
        var jiaBeiPre = this.BtnNode.getComponent("DDZ_PlayerBtn").JiaBei;
        this.BtnNode.removeAllChildren();
        var jiaBeiNode = this.BtnNode.getChildByName("DDZ_JiaBei") ? this.BtnNode.getChildByName("DDZ_JiaBei") : cc.instantiate(jiaBeiPre);
        this.BtnNode.getChildByName("DDZ_JiaBei") ? this.BtnNode.getChildByName("DDZ_JiaBei").active = true : this.BtnNode.addChild(jiaBeiNode);
    }
};
GameAction.updateJiaBei = function (data) {
    // 加倍的操作
    this.bindNodeName();
    if (this.selfID == data.retMsg.userId) {
        if (this.BtnNode.getChildByName("DDZ_JiaBei")) {
            this.BtnNode.getChildByName("DDZ_JiaBei").active = false;
            this.BtnNode.getChildByName("DDZ_JiaBei").destroy();
        }
        data.jiaBeiResult == true ? this.selfNodeComp.updateOutWord(2) : this.selfNodeComp.updateOutWord(13);
        this.selfNodeComp.showRate(data.jiaBeiResult);
        this.selfNodeComp.hideOffline();
    }
    if (data.retMsg.userId == cc.YL.DDZrightPlayerInfo.userId) {
        data.jiaBeiResult == true ? this.rightNodeComp.updateOutWord(2) : this.rightNodeComp.updateOutWord(13);
        this.rightNodeComp.showRate(data.jiaBeiResult);
        this.rightNodeComp.hideOffline();
    }
    if (data.retMsg.userId == cc.YL.DDZleftPlayerInfo.userId) {
        data.jiaBeiResult == true ? this.leftNodeComp.updateOutWord(2) : this.leftNodeComp.updateOutWord(13);
        this.leftNodeComp.showRate(data.jiaBeiResult);
        this.leftNodeComp.hideOffline();
    }
};
GameAction.endJiaBei = function () {
    // 结束加倍的操作
    this.bindNodeName();
    if (this.BtnNode.getChildByName("DDZ_JiaBei")) {
        this.BtnNode.getChildByName("DDZ_JiaBei").active = false;
        this.BtnNode.getChildByName("DDZ_JiaBei").destroy();
    }
};
GameAction.showDiPai = function (data, isReconnect) {
    // 渲染底牌//3张底牌
    var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/DiPaiNode");
    node.getComponent("DDZ_DiPai").initDiPai(data.diPais, isReconnect);
};
GameAction.removeDiPai = function () {
    // 移除渲染底牌
    var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/DiPaiNode");
    node.getComponent("DDZ_DiPai").clearDiPai();
};
GameAction.overTurn = function (data) {
    cc.YL.info("收到overturn 当前操作玩家", data.activeUser);
    this.bindNodeName();
    this.selfHandPokerNodeComp.setTouchEvent(true);
    this.selfNodeComp.showHeadAnimation(false);
    this.rightNodeComp.showHeadAnimation(false);
    this.leftNodeComp.showHeadAnimation(false);
    for (var i = 0; i < data.playerRate.length; i++) {
        if (this.selfID == data.playerRate[i].userId) {
            var UIROOT = cc.find("DDZ_UIROOT");
            cc.YL.DDZSelfRate = data.playerRate[i].rate;
            UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").initRate(data.playerRate[i].rate); // 只显示自己的倍数
        }
    }

    if (this.selfID == data.activeUser) {
        this.selfNodeComp.updateOutWord(0);
        this.selfNodeComp.showHeadAnimation(true);
        this.BtnNode.removeAllChildren();
        this.selfOutNode.removeAllChildren();
        if (data.canOut == false) {
            var passPre = this.BtnNode.getComponent("DDZ_PlayerBtn").pass;
            var passNode = this.BtnNode.getChildByName("DDZ_Pass") ? this.BtnNode.getChildByName("DDZ_Pass") : cc.instantiate(passPre);
            this.BtnNode.getChildByName("DDZ_Pass") ? this.BtnNode.getChildByName("DDZ_Pass").active = true : this.BtnNode.addChild(passNode);
            this.selfHandPokerNodeComp.setTouchEvent(false);
        } else {
            var outCardPre = this.BtnNode.getComponent("DDZ_PlayerBtn").outCard;
            var outCardNode = this.BtnNode.getChildByName("DDZ_OutCard") ? this.BtnNode.getChildByName("DDZ_OutCard") : cc.instantiate(outCardPre);
            this.BtnNode.getChildByName("DDZ_OutCard") ? this.BtnNode.getChildByName("DDZ_OutCard").active = true : this.BtnNode.addChild(outCardNode);
            outCardNode.getComponent("DDZ_OutCard").initBtnStatus(data.isNewRound);
        }
    } else if (data.activeUser == cc.YL.DDZrightPlayerInfo.userId) {
        this.rightNodeComp.showHeadAnimation(true);
        this.rightOutNode.removeAllChildren();
    } else if (data.activeUser == cc.YL.DDZleftPlayerInfo.userId) {
        this.leftNodeComp.showHeadAnimation(true);
        this.leftOutNode.removeAllChildren();
    }
    if (data.isNewRound == true) {
        setTimeout(function () {
            this.selfNodeComp.updateOutWord(0);
            this.rightNodeComp.updateOutWord(0);
            this.leftNodeComp.updateOutWord(0);
            this.leftOutNode.removeAllChildren();
            this.rightOutNode.removeAllChildren();
        }.bind(this), 300);
    }
};
GameAction.showPass = function (data) {
    // message ddz_play_pass_ack {
    //     optional int64 userId = 1;
    //     optional bool isOk = 2;
    // }
    this.bindNodeName();
    if (this.selfID == data.retMsg.userId) {
        this.selfNodeComp.updateOutWord(1);
        this.selfNodeComp.hideOffline();
    }
    if (data.retMsg.userId == cc.YL.DDZrightPlayerInfo.userId) {
        this.rightNodeComp.updateOutWord(1);
        this.rightNodeComp.hideOffline();
    }
    if (data.retMsg.userId == cc.YL.DDZleftPlayerInfo.userId) {
        this.leftNodeComp.updateOutWord(1);
        this.leftNodeComp.hideOffline();
    }
};
GameAction.showDissUI = function (data) {

    var UIROOT = cc.find("DDZ_UIROOT");
    UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showDissUI(data);
};
GameAction.showDissResult = function (data) {

    var UIROOT = cc.find("DDZ_UIROOT");
    UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showDissResult("房间已解散");
};
GameAction.outCardFail = function () {
    this.selfHandPokerNodeComp.setTouchEvent(true);
    var UIROOT = cc.find("DDZ_UIROOT");
    UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showTipStr("非法牌型，出牌失败");
};
module.exports = GameAction;
cc.YL.DDZGameAction = GameAction;

cc._RF.pop();