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
        roomAtlas: cc.SpriteAtlas,
        settingPre: cc.Prefab,
        leavePre: cc.Prefab,
        leavePopPre: cc.Prefab,
        chatPre:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.YL.DDZEventManager.init();//网络事件注册初始化
        fun.event.add('PhoneNetPhoneStatusDDZ', 'PhoneNet', this.onPhoneNetEvent.bind(this));
        fun.event.add('PhoneBatteryPhoneStatusDDZ', 'PhoneBattery', this.onPhoneBatteryEvent.bind(this));
        require("JSPhoneNetBattery").getNetBatteryStatus();
        this.bindNodeValue();
        this.reconnctAndJoinUI();
        fun.net.send("PID_LOGINSERVER", {
            userId: fun.db.getData('UserInfo').UserId,
        });
        cc.YL.DDZPlayerInfoList = [];
        fun.db.setData('RoomInfo', {
            GameType:6,
        });
    },
    update(){
        this.mobileInfoNode.getChildByName("Time").getComponent(cc.Label).string = cc.YL.DDZ_Osdate.showTime();
    },
    onDestroy(){
        cc.YL.DDZEventManager.destroy();//网络事件取消注册
    },

    initDeskUI: function (data) {
        this.initRoomInfo(data);
        this.initDiFen(data.roomInfo.base);
        this.initRate();
        this.initRuleInfo();
    },

    initRuleInfo: function () {
        var payTypeArr = ["", "平均支付", "冠军支付", "房主支付"];
        var ruleList = [payTypeArr[cc.YL.DDZDeskInfo.roomInfo.payMode], "封顶:" + cc.YL.DDZDeskInfo.roomInfo.boomLimit];
        cc.YL.DDZDeskInfo.roomInfo.canSanDaiDui ?
            ruleList.push("可三带一对") :
            null;
        cc.YL.DDZDeskInfo.roomInfo.canSiDaiDui ?
            ruleList.push("可四带两对") :
            null;
        cc.YL.DDZDeskInfo.roomInfo.canDouble ?
            ruleList.push("可加倍") :
            null;
        for (var i = 0; i < ruleList.length; i++) {
            var num = parseInt(i + 1);
            this.ruleInfoNode.getChildByName("R" + num).getComponent(cc.Label).string = ruleList[i].toString();
        }


    },
    reconnctAndJoinUI: function () {
        // 断线重连和初次加载场景，ui的defaul状态
        this.clearRate();
        this.clearDiFen();
        this.clearRoomInfo();
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
    },
    GameOverUI: function () {
        this.selfHandPokerNodeComp.clearHandPoker();
        this.rightHandPokerNodeComp.cleanHandPokerCount();
        this.leftHandPokerNodeComp.cleanHandPokerCount();
        this.selfOutNodeComp.clearOutPoker();
        this.rightOutNodeComp.clearOutPoker();
        this.leftOutNodeComp.clearOutPoker();
        this.BtnNode.removeAllChildren();
        this.clearRate();
        this.clearDiFen();
    },
    initRoomInfo: function (data) {
        var roomInfo = cc.find("DDZ_UIROOT/MainNode/BtnNode/RoomInfo/RoomNum");
        roomInfo.getComponent(cc.Label).string = "房号: "
            + data.password
            + "  局数: "
            + 0 + "/"
            + data.roomInfo.RoundLimit;
    },
    updateRoomInfo: function (juShu) {
        var roomInfo = cc.find("DDZ_UIROOT/MainNode/BtnNode/RoomInfo/RoomNum");
        roomInfo.getComponent(cc.Label).string = "房号: "
            + cc.YL.DDZDeskInfo.password
            + "  局数: "
            + juShu + "/"
            + cc.YL.DDZDeskInfo.roomInfo.RoundLimit;
    },
    clearRoomInfo: function () {
        var roomInfo = cc.find("DDZ_UIROOT/MainNode/BtnNode/RoomInfo/RoomNum");
        roomInfo.getComponent(cc.Label).string = "";
    },
    onPhoneNetEvent: function (msg) {
        var atlas = this.roomAtlas;
        if (msg.status == 5) {
            this.mobileInfoNode.getChildByName("Wifi").active = true;
            this.mobileInfoNode.getChildByName("Net").active = false;
            this.mobileInfoNode.getChildByName("Wifi").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame("wifi_" + msg.strength);

        } else if (msg.status == 0) {
            this.mobileInfoNode.getChildByName("Wifi").active = false;
            this.mobileInfoNode.getChildByName("Net").active = false;
            this.mobileInfoNode.getChildByName("Wifi").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame("xinhao5");
        } else {
            this.mobileInfoNode.getChildByName("Wifi").active = false;
            this.mobileInfoNode.getChildByName("Net").active = true;
            var singleArr = ["xinhao5","xinhao4","xinhao3","xinhao2","xinhao1"];
            this.mobileInfoNode.getChildByName("Wifi").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(singleArr[msg.signal]);
        }


    },

    onPhoneBatteryEvent: function (msg) {
        msg.status == 2 ?
            this.mobileInfoNode.getChildByName("Battery").getChildByName("isCharge").active = true :
            this.mobileInfoNode.getChildByName("Battery").getChildByName("isCharge").active = false;
        this.mobileInfoNode.getChildByName("Battery").getChildByName("BatteryIn").width = (msg.level / 39) * 39;
    },
    initReady: function (isReady) {
        if (isReady == true) {
            cc.YL.info("玩家已经准备");
            this.selfNodeComp.showAndHideReady(isReady);
        } else {
            this.BtnNode.removeAllChildren();
            var readyPre = this.BtnNode.getComponent("DDZ_PlayerBtn").ready;
            var readyNode = this.BtnNode.getChildByName("DDZ_Ready") ?
                this.BtnNode.getChildByName("DDZ_Ready") :
                cc.instantiate(readyPre);
            this.BtnNode.getChildByName("DDZ_Ready") ?
                this.BtnNode.getChildByName("DDZ_Ready").active = true :
                this.BtnNode.addChild(readyNode);
        }

    },
    initDiFen: function (data) {
        var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/GameInfo/Difen/Num");
        node.getComponent(cc.Label).string = data + "";
    },
    clearDiFen: function () {
        var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/GameInfo/Difen/Num");
        node.getComponent(cc.Label).string = "";
    },
    initRate: function (rate) {
        var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/GameInfo/Beishu/Num");
        node.getComponent(cc.Label).string = rate + "";
    },
    clearRate: function () {
        var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/GameInfo/Beishu/Num");
        node.getComponent(cc.Label).string = "";
    },
    initPlayerInfoNode: function (info, index) {
        var playerInfoNode = this.chatNode.getChildByName("DDZ_playerinfoNode") ?
            this.chatNode.getChildByName("DDZ_playerinfoNode") :
            cc.instantiate(this.playerInfoNode);
        this.chatNode.getChildByName("DDZ_playerinfoNode") ?
            this.chatNode.getChildByName("DDZ_playerinfoNode").active = true :
            this.chatNode.addChild(playerInfoNode);
        playerInfoNode.getComponent("DDZ_PlayerInfoNode").initNode(info, index);
    },
    showAllGameOver: function (data) {
        this.GameOverUI();
        var allGameOverNode = this.node.getChildByName("DDZ_AllGameOver") ?
            this.node.getChildByName("DDZ_AllGameOver") :
            cc.instantiate(this.allGameOverNode);
        this.node.getChildByName("DDZ_AllGameOver") ?
            this.node.getChildByName("DDZ_AllGameOver").active = true :
            this.node.addChild(allGameOverNode);
        allGameOverNode.getComponent("DDZ_AllGameOver").initAllGameOverNode(data);
    },
    showOneGameOver: function (data) {
        this.GameOverUI();
        var oneGameOverNode = this.node.getChildByName("DDZ_OneGameOver") ?
            this.node.getChildByName("DDZ_OneGameOver") :
            cc.instantiate(this.oneGameOverNode);
        this.node.getChildByName("DDZ_OneGameOver") ?
            this.node.getChildByName("DDZ_OneGameOver").active = true :
            this.node.addChild(oneGameOverNode);
        oneGameOverNode.getComponent("DDZ_OneGameOver").initNodeForSimple(data);
    },
    bindNodeValue: function () {
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
    onClickSetting: function () {
        cc.YL.log("设置按钮");
        var settingNode = this.node.getChildByName("set") ?
            this.node.getChildByName("set") :
            cc.instantiate(this.settingPre);
        this.node.getChildByName("set") ?
            this.node.getChildByName("set").active = true :
            this.node.addChild(settingNode);

    },

    onClickMessage: function () {
        cc.YL.log("消息按钮");
        var messageNode = this.node.getChildByName("chat") ?
            this.node.getChildByName("chat") :
            cc.instantiate(this.chatPre);
        this.node.getChildByName("chat") ?
            this.node.getChildByName("chat").active = true :
            this.node.addChild(messageNode);
    },



    onClickLeave: function () {
        cc.YL.log("离开按钮");
        var leaveNode = this.node.getChildByName("DDZ_voting") ?
            this.node.getChildByName("DDZ_voting") :
            cc.instantiate(this.leavePre);
        this.node.getChildByName("DDZ_voting") ?
            this.node.getChildByName("DDZ_voting").active = true :
            this.node.addChild(leaveNode);
    },

    onClickRule: function (event) {
        cc.YL.log("规则按钮");
        this.ruleInfoNode.parent.stopAllActions();
        this.ruleInfoNode.parent.setPosition(-1334, 0);
        this.ruleInfoNode.parent.runAction(cc.moveTo(0.1, cc.p(0, 0)));
        event.target.active = false;


    },
    onClickCloseRule: function () {
        cc.find("DDZ_UIROOT/MainNode/BtnNode/Rule").active = true;
        this.ruleInfoNode.parent.stopAllActions();
        this.ruleInfoNode.parent.setPosition(0, 0);
        this.ruleInfoNode.parent.runAction(cc.moveTo(0.1, cc.p(-1334, 0)));
    },


});
