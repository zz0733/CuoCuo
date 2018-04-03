cc.Class({
    extends: cc.Component,

    properties: {
        playerInfo:null,
        txtAtlas: cc.SpriteAtlas,
    },

    //玩家信息
//     message ddz_base_playerInfo {
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
//     optional int32 index = 12; //玩家的座位
// }
    onLoad () {
        this.playerInfo = null;
        this.BtnNode = cc.find("DDZ_UIROOT/MainNode/PlayerBtnNode");
    },
    initSelfPlayerNode: function (data) {
        this.node.active = true;
        this.playerInfo = data;
        this.clearNodeUI();
        this.initNodeUI(data);
    },
    clearNodeUI: function () {
        this.node.getChildByName("HeadNode").getComponent(cc.Sprite).spriteFrame = null;
        this.showDiZhuIcon(false);
        this.node.getChildByName("ID").getComponent(cc.Label).string = "";
        this.node.getChildByName("NickNameBG").getChildByName("Name").getComponent(cc.Label).string = "";
        this.node.getChildByName("CoinBG").getChildByName("Num").getComponent(cc.Label).string = "";
    },
    initNodeUI: function (data) {
        fun.utils.loadUrlRes(data.headUrl, this.node.getChildByName("HeadNode"));// 头像
        this.showDiZhuIcon(false);
        this.node.getChildByName("ID").getComponent(cc.Label).string = data.userId;
        this.node.getChildByName("NickNameBG").getChildByName("Name").getComponent(cc.Label).string = data.nickName;
        this.node.getChildByName("CoinBG").getChildByName("Num").getComponent(cc.Label).string = data.coin;
        this.node.getChildByName("Rate").active = false;
    },
    showAndHideReady: function (isReady) {
        if( this.BtnNode.getChildByName("DDZ_Ready")){
            this.BtnNode.getChildByName("DDZ_Ready").active = !isReady;
        }
        if(isReady == true){
            this.node.getChildByName("Word").getComponent(cc.Label).string = "准备";
        }

    },
    showDiZhuIcon: function (isDiZhu) {
        this.isDiZhu = isDiZhu;
        this.node.getChildByName("DiZhuIcon").active = this.isDiZhu;
    },
    onClickPlayerInfo: function(){
        cc.YL.log("显示玩家的信息");
        cc.find("DDZ_UIROOT/MainNode").getComponent("DDZ_Main").initPlayerInfoNode(this.playerInfo,1);
    },
    showRate: function(){
        this.node.getChildByName("Rate").active = true;
    },
    clearRate: function(){
        this.node.getChildByName("Rate").active = false;
    },
    updateOutWord: function(strType){
        // 不出 1 dz_zt0000
        // 加倍 2 dz_zt00
        // 不叫 3 dz_zt0
        // 一分 4 dz_zt1
        // 2分  5 dz_zt2
        // 3分  5 dz_zt3
        // 6分  5 dz_zt4
        // 9分  5 dz_zt5
        var fileNameArr = ["","dz_zt0000","dz_zt00","dz_zt0","dz_zt1","dz_zt2","dz_zt3","dz_zt4","dz_zt5"];
        var atlas = this.txtAtlas;
        if(strType == 0 || !strType){
            this.node.getChildByName("ShowWord").active = false;
        }else{
            this.node.getChildByName("ShowWord").active = true;
            this.node.getChildByName("ShowWord").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(fileNameArr[strType]);
        }

    },
});
