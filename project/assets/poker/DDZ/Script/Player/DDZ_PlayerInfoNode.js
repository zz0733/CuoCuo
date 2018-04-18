// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        GPSPre: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initNode: function (playerInfo, index) {
        this.initByData(playerInfo);
        this.selfPos = cc.p(-304, -128);
        this.rightPos = cc.p(304, 202);
        this.leftPos = cc.p(-304, 202);
        switch (index) {
            case 1: {
                this.node.getChildByName("BG").setPosition(this.selfPos);
                this.node.getChildByName("BG").getChildByName("Buttom").active = false;
                break;
            }
            case 2: {
                this.node.getChildByName("BG").setPosition(this.rightPos);
                this.toID = cc.YL.DDZrightPlayerInfo.userId;
                break;
            }
            case 3: {
                this.node.getChildByName("BG").setPosition(this.leftPos);
                this.toID = cc.YL.DDZleftPlayerInfo.userId;
                break;
            }
        }
    },
    initByData: function (data) {
        this.node.getChildByName("BG").getChildByName("Top").getChildByName("nickName").getComponent(cc.Label).string = "昵称: " + data.nickName.toString();
        this.node.getChildByName("BG").getChildByName("Top").getChildByName("ID").getComponent(cc.Label).string = "ID: " + data.userId.toString();
        this.node.getChildByName("BG").getChildByName("Mid").getChildByName("Distance").getComponent(cc.Label).string = "IP: " + data.ip.toString();

    },
    onClickGPSDetail: function () {
        cc.YL.log("点击打开GPS详情");
        var rootUI = cc.find("DDZ_UIROOT/MainNode");
        var gpsNode = rootUI.getChildByName("DDZ_Map") ?
            rootUI.getChildByName("DDZ_Map") :
            cc.instantiate(this.GPSPre);
        rootUI.getChildByName("DDZ_Map") ?
            rootUI.getChildByName("DDZ_Map").active = true :
            rootUI.addChild(gpsNode);
        var playerinfos = this.playerInfos();
        gpsNode.getComponent("DDZ_PlayerGPS").show(playerinfos);
    },
    onClickTools: function (event, custom) {
        var outside = {
            content: custom,
            from: fun.db.getData('UserInfo').UserId,
            to: this.toID,
            chatType: "interact"
        }
        fun.net.pSend("Chat", outside);
    },
    onCloseNode: function () {
        this.node.active = false;
        this.node.destroy();
    },
    playerInfos: function () {
        var tempArr = [];
        if (cc.YL.DDZselfPlayerInfo) {
            tempArr.push({
                Address: cc.YL.DDZselfPlayerInfo.gps ? cc.YL.DDZselfPlayerInfo.gps : null,
                // Address:{"lat":"30.544779","lng":"104.062456","locdesc":"中国四川省成都市武侯区大源1线在成都移动互联创业大厦附近"},
                Feng: null,
                HeadUrl: cc.YL.DDZselfPlayerInfo.headUrl,
                Ip:cc.YL.DDZselfPlayerInfo.ip,
                Sex:cc.YL.DDZselfPlayerInfo.sex,
                UserId:cc.YL.DDZselfPlayerInfo.userId,
                Name:cc.YL.DDZselfPlayerInfo.nickName,
                name:cc.YL.DDZselfPlayerInfo.nickName,
                showName:cc.YL.DDZselfPlayerInfo.nickName,
                PlayerIdx: cc.YL.DDZselfPlayerInfo.index,
                Icon:cc.YL.DDZrightPlayerInfo.headUrl,
                isSelfPlayed:true,
                isTruePlayer:true,
            });
        }
        if (cc.YL.DDZrightPlayerInfo) {
            tempArr.push({
                Address: cc.YL.DDZrightPlayerInfo.gps? cc.YL.DDZrightPlayerInfo.gps : null,
                // Address:{"lat":"30.544779","lng":"104.062456","locdesc":"中国四川省成都市武侯区大源1线在成都移动互联创业大厦附近"},
                Feng: null,
                HeadUrl: cc.YL.DDZrightPlayerInfo.headUrl,
                Ip:cc.YL.DDZrightPlayerInfo.ip,
                Sex:cc.YL.DDZrightPlayerInfo.sex,
                UserId:cc.YL.DDZrightPlayerInfo.userId,
                Name:cc.YL.DDZrightPlayerInfo.nickName,
                name:cc.YL.DDZrightPlayerInfo.nickName,
                showName:cc.YL.DDZrightPlayerInfo.nickName,
                PlayerIdx: cc.YL.DDZrightPlayerInfo.index,
                Icon:cc.YL.DDZrightPlayerInfo.headUrl,
                isSelfPlayed:false,
                isTruePlayer:true,
            });
        }
        if (cc.YL.DDZleftPlayerInfo) {
            tempArr.push({
                Address: cc.YL.DDZleftPlayerInfo.gps? cc.YL.DDZleftPlayerInfo.gps : null,
                // Address:{"lat":"30.544779","lng":"104.062456","locdesc":"中国四川省成都市武侯区大源1线在成都移动互联创业大厦附近"},
                Feng: null,
                HeadUrl: cc.YL.DDZleftPlayerInfo.headUrl,
                Ip:cc.YL.DDZleftPlayerInfo.ip,
                Sex:cc.YL.DDZleftPlayerInfo.sex,
                UserId:cc.YL.DDZleftPlayerInfo.userId,
                Name:cc.YL.DDZleftPlayerInfo.nickName,
                name:cc.YL.DDZleftPlayerInfo.nickName,
                showName:cc.YL.DDZleftPlayerInfo.nickName,
                PlayerIdx: cc.YL.DDZleftPlayerInfo.index,
                Icon:cc.YL.DDZrightPlayerInfo.headUrl,
                isSelfPlayed:false,
                isTruePlayer:true,
            });
        }
        return tempArr;

    },
    // update (dt) {},
});
