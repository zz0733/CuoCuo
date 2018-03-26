/********
 * 房间渲染相关
 * *********/

var DDZGameManager = cc.Class({});
DDZGameManager.bindNodeValue = function () {
    this.selfID = fun.db.getData('UserInfo').UserId;
    this.selfNode = cc.find("DDZ_UIROOT/MainNode/SelfPlayerInfo");
    this.rightNode = cc.find("DDZ_UIROOT/MainNode/RightPlayerInfo");
    this.leftNode = cc.find("DDZ_UIROOT/MainNode/LeftPlayerInfo");
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
    var UIROOT = cc.find("DDZ_UIROOT");

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

};
module.exports = DDZGameManager;
cc.YL.DDZGameManager = DDZGameManager;