"use strict";
cc._RF.push(module, 'a1639t9XUdEAJNZ0mAetgN8', 'DDZ_Main');
// poker/DDZ/Script/Desk/DDZ_Main.js

'use strict';

/***************************
 * 整个斗地主游戏的入口
 * 同时也包括一些简单的初始化工作
 * *******/

cc.Class({
    extends: cc.Component,

    properties: {
        playerInfoNode: cc.Prefab,
        oneGameOverNode: cc.Prefab,
        allGameOverNode: cc.Prefab,
        settingPre: cc.Prefab,
        leavePre: cc.Prefab,
        leavePopPre: cc.Prefab,
        chatPre: cc.Prefab,
        popWinPre: cc.Prefab,
        faPaiPre: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        cc.YL.DDZEventManager.init(); //网络事件注册初始化
        fun.event.add('PhoneNetPhoneStatusDDZ', 'PhoneNet', this.onPhoneNetEvent.bind(this));
        fun.event.add('PhoneBatteryPhoneStatusDDZ', 'PhoneBattery', this.onPhoneBatteryEvent.bind(this));
        fun.event.add("DDZReconnect", "ReconnectInGame", this.initUI.bind(this));
        require("JSPhoneNetBattery").getNetBatteryStatus();
        cc.YL.info("斗地主初始化");
        this.initUI();
    },
    update: function update() {
        this.mobileInfoNode.getChildByName("Time").getComponent(cc.Label).string = cc.YL.DDZ_Osdate.showTime();
    },
    onDestroy: function onDestroy() {
        cc.YL.DDZEventManager.destroy(); //网络事件取消注册
        fun.event.remove('PhoneNetPhoneStatusDDZ');
        fun.event.remove('PhoneBatteryPhoneStatusDDZ');
        fun.event.remove("DDZReconnect");
        fun.db.setData('RoomInfo', {
            GameType: 0
        });
        var userInfo = fun.db.getData('UserInfo');
        userInfo.RoomId = 0;
        fun.db.setData('UserInfo', userInfo);
        cc.YL.DDZAllGameOverData = null;
        cc.YL.DDZDeskInfo = null;
        cc.YL.DDZselfPlayerInfo = null;
        cc.YL.DDZleftPlayerInfo = null;
        cc.YL.DDZrightPlayerInfo = null;
        cc.YL.DDZCurrentRound = null;
        cc.YL.DDZSelfRate = "";
        cc.YL.DeskDiFen = "";
        this.unschedule(this.DDZNetDelayTime);
    },

    initUI: function initUI() {
        cc.YL.info("initUI");
        this.bindNodeValue();
        this.reconnctAndJoinUI();
        this.phoenNetState = null;
        fun.net.send("PID_LOGINSERVER_REQ", {
            userId: fun.db.getData('UserInfo').UserId
        });
        cc.YL.DDZPlayerInfoList = [];
        fun.db.setData('RoomInfo', {
            GameType: 6
        });
        cc.YL.DDZAudio.playBGM();
        fun.event.dispatch('Zhuanquan', false);
        this.startShowDelayTime();
    },
    initDeskUI: function initDeskUI(data) {
        this.initRoomInfo(data);
        this.initDiFen(data.diFen);
        this.initRate(cc.YL.DDZSelfRate);
        this.initRuleInfo();
    },

    initRuleInfo: function initRuleInfo() {
        var payTypeArr = ["", "平均支付", "冠军支付", "房主支付"];
        var ruleList = [payTypeArr[cc.YL.DDZDeskInfo.roomInfo.payMode], "封顶:" + cc.YL.DDZDeskInfo.roomInfo.boomLimit];
        cc.YL.DDZDeskInfo.roomInfo.canSanDaiDui ? ruleList.push("可三带一对") : null;
        cc.YL.DDZDeskInfo.roomInfo.canSiDaiDui ? ruleList.push("可四带两对") : null;
        cc.YL.DDZDeskInfo.roomInfo.canDouble ? ruleList.push("可加倍") : null;
        for (var i = 0; i < ruleList.length; i++) {
            var num = parseInt(i + 1);
            this.ruleInfoNode.getChildByName("R" + num).getComponent(cc.Label).string = ruleList[i].toString();
        }
    },
    reconnctAndJoinUI: function reconnctAndJoinUI() {
        // 断线重连和初次加载场景，ui的defaul状态
        this.clearRate();
        this.clearDiFen();
        this.clearRoomInfo();
        this.clearAnimationNode();
        cc.YL.DDZGameAction.removeDiPai();
        this.selfHandPokerNodeComp.clearHandPoker();
        this.rightHandPokerNodeComp.cleanHandPokerCount();
        this.leftHandPokerNodeComp.cleanHandPokerCount();
        this.selfOutNodeComp.clearOutPoker();
        this.rightOutNodeComp.clearOutPoker();
        this.leftOutNodeComp.clearOutPoker();
        this.selfNodeComp.clearNodeUI();
        this.rightNodeComp.clearNodeUI();
        this.leftNodeComp.clearNodeUI();
        this.BtnNode.removeAllChildren();
        this.selfNodeComp.clearRate();
        this.selfNodeComp.showDiZhuIcon(false);
        this.rightNodeComp.clearRate();
        this.rightNodeComp.showDiZhuIcon(false);
        this.leftNodeComp.clearRate();
        this.leftNodeComp.showDiZhuIcon(false);
        this.node.getChildByName("ChatRoot").removeAllChildren();
    },
    GameOverUI: function GameOverUI() {
        this.selfHandPokerNodeComp.clearHandPoker();
        this.rightHandPokerNodeComp.cleanHandPokerCount();
        this.leftHandPokerNodeComp.cleanHandPokerCount();
        this.selfOutNodeComp.clearOutPoker();
        this.rightOutNodeComp.clearOutPoker();
        this.leftOutNodeComp.clearOutPoker();
        this.selfNodeComp.clearRate();
        this.selfNodeComp.showDiZhuIcon(false);
        this.rightNodeComp.clearRate();
        this.rightNodeComp.showDiZhuIcon(false);
        this.leftNodeComp.clearRate();
        this.leftNodeComp.showDiZhuIcon(false);
        this.BtnNode.removeAllChildren();
        this.clearRate();
        this.clearAnimationNode();
        cc.YL.DDZGameAction.removeDiPai();
        this.initDiFen(cc.YL.DDZDeskInfo.diFen);
        this.node.getChildByName("ChatRoot").removeAllChildren();
    },
    initRoomInfo: function initRoomInfo(data) {
        var roomInfo = cc.find("DDZ_UIROOT/MainNode/BtnNode/RoomInfo/RoomNum");
        roomInfo.getComponent(cc.Label).string = "房号: " + data.password + "  局数: " + data.currentRound + "/" + data.roomInfo.RoundLimit;
        cc.YL.DDZCurrentRound = data.currentRound;
        cc.YL.loaderID = data.diZhu;
    },
    updateRoomInfo: function updateRoomInfo(juShu) {
        var roomInfo = cc.find("DDZ_UIROOT/MainNode/BtnNode/RoomInfo/RoomNum");
        roomInfo.getComponent(cc.Label).string = "房号: " + cc.YL.DDZDeskInfo.password + "  局数: " + juShu + "/" + cc.YL.DDZDeskInfo.roomInfo.RoundLimit;
    },
    clearRoomInfo: function clearRoomInfo() {
        var roomInfo = cc.find("DDZ_UIROOT/MainNode/BtnNode/RoomInfo/RoomNum");
        roomInfo.getComponent(cc.Label).string = "";
    },
    onPhoneNetEvent: function onPhoneNetEvent(msg) {
        cc.YL.log("斗地主onPhoneNetEvent>>>>msg.status", msg.status);
        this.phoenNetState = msg.status;
        this.DDZNetDelayTime();
    },
    startShowDelayTime: function startShowDelayTime() {
        this.DDZNetDelayTime();
        this.schedule(this.DDZNetDelayTime, 10);
    },
    DDZNetDelayTime: function DDZNetDelayTime() {
        if (this.phoenNetState == null) {
            return;
        }
        this.mobileInfoNode = cc.find("DDZ_UIROOT/MainNode/BtnNode/MobileInfo");
        var time = fun.db.getData('NetDelayTime');
        this.mobileInfoNode.getChildByName("DelayTime").getComponent(cc.Label).string = time + "ms";
        var state = fun.utils.getNetDelayTime(time);
        for (var i = 0; i < this.mobileInfoNode.getChildByName("Wifi").children.length; i++) {
            this.mobileInfoNode.getChildByName("Wifi").children[i].color = new cc.Color(state.rgb);
            this.mobileInfoNode.getChildByName("Wifi").children[i].active = false;
        }
        for (var i = 0; i < this.mobileInfoNode.getChildByName("Net").children.length; i++) {
            this.mobileInfoNode.getChildByName("Net").children[i].color = new cc.Color(state.rgb);
            this.mobileInfoNode.getChildByName("Net").children[i].active = false;
        }
        if (this.phoenNetState == 5) {
            this.mobileInfoNode.getChildByName("Wifi").getChildByName("Wifi" + state.idx).active = true;
            cc.YL.log("开启的节点name", this.mobileInfoNode.getChildByName("Wifi").getChildByName("Wifi" + state.idx).name);
        } else {
            this.mobileInfoNode.getChildByName("Net").getChildByName("Net" + state.idx).active = true;
            cc.YL.log("开启的节点name", this.mobileInfoNode.getChildByName("Net").getChildByName("Net" + state.idx).name);
        }
        cc.YL.log("斗地主DDZNetDelayTime>>>>state.idx", state.idx);
    },

    onPhoneBatteryEvent: function onPhoneBatteryEvent(msg) {
        this.mobileInfoNode = cc.find("DDZ_UIROOT/MainNode/BtnNode/MobileInfo");
        cc.YL.log("斗地主onPhoneBatteryEvent>>>>msg.status", msg.status);
        if (msg.status >= 2) {
            this.mobileInfoNode.getChildByName("Battery").getChildByName("isCharge").active = true;
        } else {
            this.mobileInfoNode.getChildByName("Battery").getChildByName("isCharge").active = false;
        }
        this.mobileInfoNode.getChildByName("Battery").getChildByName("BatteryIn").width = msg.level / 100 * 39;
    },
    initReady: function initReady(isReady) {
        if (isReady == true) {
            cc.YL.info("玩家已经准备");
            this.selfNodeComp.showAndHideReady(isReady);
        } else {
            this.BtnNode.removeAllChildren();
            var readyPre = this.BtnNode.getComponent("DDZ_PlayerBtn").ready;
            var readyNode = this.BtnNode.getChildByName("DDZ_Ready") ? this.BtnNode.getChildByName("DDZ_Ready") : cc.instantiate(readyPre);
            this.BtnNode.getChildByName("DDZ_Ready") ? this.BtnNode.getChildByName("DDZ_Ready").active = true : this.BtnNode.addChild(readyNode);
        }
    },
    initDiFen: function initDiFen(data) {
        var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/GameInfo/Difen/Num");
        node.getComponent(cc.Label).string = data + "";
    },
    clearDiFen: function clearDiFen() {
        var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/GameInfo/Difen/Num");
        node.getComponent(cc.Label).string = "";
    },
    initRate: function initRate(rate) {
        if (rate) {
            var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/GameInfo/Beishu/Num");
            node.getComponent(cc.Label).string = rate + "";
        }
    },
    clearRate: function clearRate() {
        var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/GameInfo/Beishu/Num");
        node.getComponent(cc.Label).string = "1";
    },
    initPlayerInfoNode: function initPlayerInfoNode(info, index) {
        var playerInfoNode = this.chatNode.getChildByName("DDZ_playerinfoNode") ? this.chatNode.getChildByName("DDZ_playerinfoNode") : cc.instantiate(this.playerInfoNode);
        this.chatNode.getChildByName("DDZ_playerinfoNode") ? this.chatNode.getChildByName("DDZ_playerinfoNode").active = true : this.chatNode.addChild(playerInfoNode);
        playerInfoNode.getComponent("DDZ_PlayerInfoNode").initNode(info, index);
    },
    showAllGameOver: function showAllGameOver(data) {
        this.GameOverUI();
        var allGameOverNode = this.node.getChildByName("DDZ_AllGameOver") ? this.node.getChildByName("DDZ_AllGameOver") : cc.instantiate(this.allGameOverNode);
        this.node.getChildByName("DDZ_AllGameOver") ? this.node.getChildByName("DDZ_AllGameOver").active = true : this.node.addChild(allGameOverNode, 400);
        allGameOverNode.getComponent("DDZ_AllGameOver").initAllGameOverNode(data);
    },
    showOneGameOver: function showOneGameOver(data) {
        this.GameOverUI();
        var oneGameOverNode = this.node.getChildByName("DDZ_OneGameOver") ? this.node.getChildByName("DDZ_OneGameOver") : cc.instantiate(this.oneGameOverNode);
        this.node.getChildByName("DDZ_OneGameOver") ? this.node.getChildByName("DDZ_OneGameOver").active = true : this.node.addChild(oneGameOverNode, 100);
        oneGameOverNode.getComponent("DDZ_OneGameOver").initNodeForSimple(data);
    },
    showDissUI: function showDissUI(data) {

        var DissNode = this.node.getChildByName("DDZ_votingPop") ? this.node.getChildByName("DDZ_votingPop") : cc.instantiate(this.leavePopPre);
        this.node.getChildByName("DDZ_votingPop") ? this.node.getChildByName("DDZ_votingPop").active = true : this.node.addChild(DissNode);
        DissNode.getComponent("DDZ_Disslove").initUI(data);
    },
    showDissResult: function showDissResult(str) {
        this.showPopWin(str, 2);
    },
    showPopWin: function showPopWin(str, type) {
        if (this.node.getChildByName("DDZ_votingPop")) {
            this.node.getChildByName("DDZ_votingPop").active = false;
            this.node.getChildByName("DDZ_votingPop").destroy();
        }
        var popNode = this.node.getChildByName("DDZ_popWin") ? this.node.getChildByName("DDZ_popWin") : cc.instantiate(this.popWinPre);
        this.node.getChildByName("DDZ_popWin") ? this.node.getChildByName("DDZ_popWin").active = true : this.node.addChild(popNode);
        popNode.getComponent("DDZ_PopWin").initPopStr(str, type);
    },
    showTipStr: function showTipStr(str) {
        this.node.getChildByName("TipNode").getComponent(cc.Label).string = str;
        setTimeout(function () {
            this.node.getChildByName("TipNode").getComponent(cc.Label).string = "";
        }.bind(this), 500);
    },
    clearAnimationNode: function clearAnimationNode() {
        cc.find("DDZ_UIROOT/MainNode/AnimationRoot").removeAllChildren();
    },
    showFaPaiAction: function showFaPaiAction() {
        var actionNode = this.node.getChildByName("DDZ_FaPaiNode") ? this.node.getChildByName("DDZ_FaPaiNode") : cc.instantiate(this.faPaiPre);
        this.node.getChildByName("DDZ_FaPaiNode") ? this.node.getChildByName("DDZ_FaPaiNode").active = true : this.node.addChild(actionNode);
        actionNode.getComponent("DDZ_FaiPaiAction").startFaPai();
    },
    /******************************************************************/
    bindNodeValue: function bindNodeValue() {
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
        this.ruleInfoNode = cc.find("DDZ_UIROOT/MainNode/RuleInfo/BG");
        this.chatNode = cc.find("DDZ_UIROOT/MainNode/ChatRoot");
        this.mobileInfoNode = cc.find("DDZ_UIROOT/MainNode/BtnNode/MobileInfo");
    },
    /*************************************界面的按钮交互**************************************/
    onClickSetting: function onClickSetting() {
        cc.YL.log("设置按钮");
        cc.YL.DDZAudio.playBtnClick();
        var settingNode = this.node.getChildByName("set") ? this.node.getChildByName("set") : cc.instantiate(this.settingPre);
        this.node.getChildByName("set") ? this.node.getChildByName("set").active = true : this.node.addChild(settingNode);
    },

    onClickMessage: function onClickMessage() {
        cc.YL.log("消息按钮");
        cc.YL.DDZAudio.playBtnClick();
        var messageNode = this.node.getChildByName("chat") ? this.node.getChildByName("chat") : cc.instantiate(this.chatPre);
        this.node.getChildByName("chat") ? this.node.getChildByName("chat").active = true : this.node.addChild(messageNode);
    },

    onClickLeave: function onClickLeave() {
        cc.YL.log("离开按钮");
        cc.YL.DDZAudio.playBtnClick();
        var leaveNode = this.node.getChildByName("DDZ_voting") ? this.node.getChildByName("DDZ_voting") : cc.instantiate(this.leavePre);
        this.node.getChildByName("DDZ_voting") ? this.node.getChildByName("DDZ_voting").active = true : this.node.addChild(leaveNode);
        leaveNode.getComponent("DDZ_LeaveAndDiss").initUIByStatus();
    },

    onClickRule: function onClickRule(event) {
        cc.YL.log("规则按钮");
        cc.YL.DDZAudio.playBtnClick();
        this.ruleInfoNode.parent.stopAllActions();
        this.ruleInfoNode.parent.setPosition(-1334, 0);
        this.ruleInfoNode.parent.runAction(cc.moveTo(0.1, cc.p(0, 0)));
        event.target.active = false;
    },
    onClickCloseRule: function onClickCloseRule() {
        cc.YL.DDZAudio.playBtnClick();
        cc.find("DDZ_UIROOT/MainNode/BtnNode/Rule").active = true;
        this.ruleInfoNode.parent.stopAllActions();
        this.ruleInfoNode.parent.setPosition(0, 0);
        this.ruleInfoNode.parent.runAction(cc.moveTo(0.1, cc.p(-1334, 0)));
    }

});

cc._RF.pop();