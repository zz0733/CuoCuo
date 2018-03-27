
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
    },

    onLoad () {
        this.playerInfo = null;
    },
    initRightPlayerNode: function(data){
        this.playerInfo = data;
        this.clearNodeUI();
        this.initNodeUI(data);
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
    },
    showAndHideReady: function(isReady){

    },
    showDiZhuIcon: function (isDiZhu) {
        this.isDiZhu = isDiZhu;
        this.node.getChildByName("DiZhuIcon").active = this.isDiZhu;
    },
    onClickPlayerInfo: function(){
        cc.YL.log("显示玩家的信息");
    },
});
