/***************************
 * 整个斗地主游戏的入口
 * 同时也包括一些简单的初始化工作
 * *******/

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.YL.DDZEventManager.init();//网络事件注册初始化
        fun.event.add('PhoneNetPhoneStatusDDZ', 'PhoneNet', this.onPhoneNetEvent.bind(this));
        fun.event.add('PhoneBatteryPhoneStatusDDZ', 'PhoneBattery', this.onPhoneBatteryEvent.bind(this));
        require("JSPhoneNetBattery").getNetBatteryStatus();
        this.bindNodeValue();
        this.reconnctAndJoinUI();
    },
    onDestroy(){
        cc.YL.DDZEventManager.destroy();//网络事件取消注册
    },

    initDeskUI: function (data) {
        // message ddz_base_deskInfo {
        //     optional uint32 password = 1; // 房间号
        //     optional deskGameStatus status = 2;
        //     optional ddz_base_roomInfo roomInfo = 3; //房间信息
        // }
        // message ddz_base_roomInfo {
        //     optional paymentMode payMode = 2; //支付方式
        //     optional int32 playerNum = 3; //玩家人数
        //     optional int32 base = 4; //底分
        //     optional int32 boomLimit = 5; //炸弹限制
        //     optional gameMode playMode = 6; //玩法
        //     optional int32 RoundLimit = 7; //局数限制
        //     optional bool needGPS = 8; //是否需要开启GPS
        // }
        this.initRoomInfo(data);
        this.initDiFen(data.roomInfo.base);


    },
    reconnctAndJoinUI: function () {
        // 断线重连和初次加载场景，ui的defaul状态
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
    },
    initRoomInfo: function (data) {
        var roomInfo = cc.find("DDZ_UIROOT/MainNode/BtnNode/RoomInfo/RoomNum");
        roomInfo.getComponent(cc.Label).string = "房号: "
            + data.password
            + "  局数: "
            + 0 + "/"
            + data.RoundLimit;
    },
    updateRoomInfo: function (juShu) {
        var roomInfo = cc.find("DDZ_UIROOT/MainNode/BtnNode/RoomInfo/RoomNum");
        roomInfo.getComponent(cc.Label).string = "房号: "
            + cc.YL.DDZDeskInfo.password
            + "  局数: "
            + juShu + "/"
            + cc.YL.DDZDeskInfo.RoundLimit;
    },
    clearRoomInfo: function () {
        var roomInfo = cc.find("DDZ_UIROOT/MainNode/BtnNode/RoomInfo/RoomNum");
        roomInfo.getComponent(cc.Label).string = "";
    },
    onPhoneNetEvent: function (msg) {

    },

    onPhoneBatteryEvent: function (msg) {

    },
    initReady: function () {
        this.BtnNode.removeAllChildren();
        var readyPre = this.BtnNode.getComponent("DDZ_PlayerBtn").ready;
        var readyNode = this.BtnNode.getChildByName("DDZ_Ready") ?
            this.BtnNode.getChildByName("DDZ_Ready") :
            cc.instantiate(readyPre);
        this.BtnNode.getChildByName("DDZ_Ready") ?
            this.BtnNode.getChildByName("DDZ_Ready").active = true :
            this.BtnNode.addChild(readyNode);
    },
    initDiFen: function (data) {
        var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/GameInfo/Difen/Num");
        node.getComponent(cc.Label).string = data + "";
    },
    clearDiFen: function () {
        var node = cc.find("DDZ_UIROOT/MainNode/BtnNode/GameInfo/Difen/Num");
        node.getComponent(cc.Label).string = "";
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
    },
    /*************************************界面的按钮交互**************************************/
    onClickSetting: function () {
        cc.YL.log("设置按钮");

    },

    onClickMessage: function () {
        cc.YL.log("消息按钮");
    },

    onClickVoice: function () {
        cc.YL.log("语音按钮");
    },

    onClickLeave: function () {
        cc.YL.log("离开按钮");
    },

    onClickRule: function () {
        cc.YL.log("规则按钮");
    },


    Test: function () {
        //测试按钮
        var TestArr = [3, 4, 5, 16, 17, 18, 28, 29, 30, 31, 41, 42, 43, 44, 54, 53, 50, 25];
        var selfHandPokerNode = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
        selfHandPokerNode.getComponent("DDZ_PlayerSelfPoker").initHandPoker(TestArr);
    },
    Test_1: function () {
        cc.YL.PokerTip.startAnalysis();

    },
    Test_2: function () {
        cc.YL.PokerTip.clickTipsBtn(2, 2, [3, 3, 3, 4, 4, 4, 5, 6]);

    }
});
