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
        this.clearRate();
        this.updateOutWord(parseInt(0));
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
        if(cc.YL.DDZDeskInfo.status == 4 && data.isJiaoFen != -1){
            // 叫分阶段
            this.updateOutWord(parseInt(data.isJiaoFen + 3));
        }
        if( data.isJiaBei == 1){
          this.showRate(true);
        }
        if (data.isJiaBei != 0 && cc.YL.DDZDeskInfo.status == 5) {
            data.isJiaBei == 1 ?
                this.updateOutWord(2) :
                this.updateOutWord(13);
        }
        if((cc.YL.DDZDeskInfo.status == 5 || cc.YL.DDZDeskInfo.status == 6)
        && cc.YL.loaderID == cc.YL.DDZselfPlayerInfo.userId){
            this.showDiZhuIcon(true);
        }
        this.hideOffline();
        if(data.isBreak === true){
            this.showOffline();
        }
    },
    showOffline: function(){
        this.node.getChildByName("OfflineNode").active = true;
    },
    hideOffline: function(){
        this.node.getChildByName("OfflineNode").active = false;
    },
    showAndHideReady: function (isReady) {
        if( this.BtnNode.getChildByName("DDZ_Ready")){
            this.BtnNode.getChildByName("DDZ_Ready").active = !isReady;
        }
        if(isReady == true){
            this.node.getChildByName("Word").active = true;
        }  else{
            this.node.getChildByName("Word").active = false;
        }

    },
    showDiZhuIcon: function (isDiZhu) {
        this.isDiZhu = isDiZhu;
        this.node.getChildByName("DiZhuIcon").active = this.isDiZhu;
    },
    onClickPlayerInfo: function(){
        cc.YL.DDZAudio.playBtnClick();
        cc.find("DDZ_UIROOT/MainNode").getComponent("DDZ_Main").initPlayerInfoNode(this.playerInfo,1);
    },
    showRate: function(active){
        this.node.getChildByName("Rate").active = active;
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
        // 3分  6 dz_zt3
        // 6分  7 dz_zt4
        // 9分  8 dz_zt5
        // 不加倍 9
        var fileNameArr = ["","dz_zt000","dz_zt00","dz_zt0","dz_zt1","dz_zt2","dz_zt3","","","dz_zt4","","","dz_zt5","dz_zt7"];
        var atlas = this.txtAtlas;
        if(strType == 0 ){
            this.node.getChildByName("ShowWord").active = false;
        }else{
            this.node.getChildByName("ShowWord").active = true;
            this.node.getChildByName("ShowWord").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(fileNameArr[strType]);
        }

    },
    showHeadAnimation: function (isShow) {
        this.node.getChildByName("HeadAnim").getComponent(sp.Skeleton).animation = "animation";
        this.node.getChildByName("HeadAnim").active = isShow;
    }
});
