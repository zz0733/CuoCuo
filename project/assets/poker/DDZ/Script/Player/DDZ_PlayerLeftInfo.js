/******* 左边玩家
 * 除牌以外的其他相关操作
 * 渲染头像，分数，聊天等
 * *******/
cc.Class({
    extends: cc.Component,

    properties: {
        // message ddz_base_playerInfo {
        //     optional int64 userId = 1; //ID
        //     optional string nickName = 2; //昵称
        //     optional int32 sex = 3; //性别
        //     optional string headUrl = 4; //头像
        //     optional int32 coin = 5; //分数（金币）
        //     optional playerGameStatus status = 6; //游戏状态
        //     optional bool isReady = 7; //是否准备
        //     optional bool isBreak = 8; //是否掉线
        //     optional bool isLeave = 9; //是否离开
        //     optional int32 score = 10; //分数
        //     optional string ip = 11; //玩家IP
        // }
        playerInfo: null,
    },
    onLoad () {
        this.playerInfo = null;
        this.BtnNode = cc.find("DDZ_UIROOT/MainNode/PlayerBtnNode");
    },
    initLeftPlayerNode: function (data) {
        this.node.active = true;
        this.playerInfo = data;
        this.clearNodeUI();
        this.initNodeUI(data);
        this.showAndHideReady(data.isReady);
    },
    clearNodeUI: function () {
        this.node.getChildByName("HeadNode").getComponent(cc.Sprite).spriteFrame = null;
        this.showDiZhuIcon(false);
        this.node.getChildByName("ID").getComponent(cc.Label).string = "";
        this.node.getChildByName("NickNameBG").getChildByName("Name").getComponent(cc.Label).string = "";
        this.node.getChildByName("NickNameBG").getChildByName("Num").getComponent(cc.Label).string = "";
    },
    initNodeUI: function (data) {
        fun.utils.loadUrlRes(data.headUrl, this.node.getChildByName("HeadNode"));// 头像
        this.showDiZhuIcon(false);
        this.node.getChildByName("ID").getComponent(cc.Label).string = data.userId;
        this.node.getChildByName("NickNameBG").getChildByName("Name").getComponent(cc.Label).string = data.nickName;
        this.node.getChildByName("NickNameBG").getChildByName("Num").getComponent(cc.Label).string = data.coin;
        this.node.getChildByName("Rate").active = false;
    },
    showAndHideReady: function (isReady) {
        if (isReady == true && cc.YL.DDZDeskInfo.status <= 2) {
            this.node.getChildByName("Word").getComponent(cc.Label).string = "准备";
        }
    },
    showDiZhuIcon: function (isDiZhu) {
        this.isDiZhu = isDiZhu;
        this.node.getChildByName("DiZhuIcon").active = this.isDiZhu;
    },
    onClickPlayerInfo: function () {
        cc.YL.log("显示玩家的信息");
        cc.find("DDZ_UIROOT/MainNode").getComponent("DDZ_Main").initPlayerInfoNode(this.playerInfo,3);
    },
    showRate: function () {
        this.node.getChildByName("Rate").active = true;
    },
    clearRate: function () {
        this.node.getChildByName("Rate").active = false;
    },

});
