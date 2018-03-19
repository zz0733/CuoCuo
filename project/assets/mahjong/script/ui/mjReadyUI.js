var mjDataMgr     = require("mjDataMgr");
var gameManager     = require("mjGameManager");
var GameDefine      = require("mjGameDefine");
var log             = cc.log;
// var FromPhone  = require("FromPhone");
var mjNetMgr   = require("mjNetMgr");


cc.Class({
    extends: cc.Component,

    properties: {
        readyN     : cc.Node, 
        typeConentN: cc.Node,
        reportN    : cc.Node,
        reportTipsN: cc.Node,
        mjVotingUIP: cc.Prefab,
        roomIdN    : cc.Node,
    },

    onLoad : function(){
        fun.event.add("selfReady", "selfReady", this.refreBtnReady.bind(this))
        this.roomIdN.getChildByName("content").getComponent(cc.Label).string = mjDataMgr.get(mjDataMgr.KEYS.ROOMID);
    },

    onDestroy : function(){
        fun.event.remove("selfReady");
    },

    initUI : function(roomInfo){
        var isHy= fun.db.getData('RoomInfo').GameType == gameConst.gameType.maJiangHuangYan
        var iss = require("mjReplayMgr").isReplayPai();
        this.reportTipsN.active = isHy && !iss;
        var isMaster                                     = mjDataMgr.getInstance().isRoomMaster();
        this.readyN.getChildByName('btnUnReady').active  = false;
        this.readyN.getChildByName("btnDissolve").active = isMaster;
        this.readyN.getChildByName("btnOut").active      = !isMaster;
        this.readyN.getChildByName('btnInvite').active   = !(fun.gameCfg.releaseType === gameConst.releaseType.apple); 
        //is the game aleady begin
        var isGamePlayed        = (roomInfo.Round > 0)
        this.roomIdN.active     = isGamePlayed;
        if(isGamePlayed){
            this.hideRoomOptBtn();
            this.reportTipsN.active = false;
        }
    },


    //wechat share room info
    onBtnWxShareRoomInfo : function () {
        var roomShowList = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO).showList;
        var content      = "";
        roomShowList.forEach(function(itemData, index){
            content += " " +itemData.name +":" + itemData.content;
        });
        var info   = {content : content};
        info.title = mjDataMgr.get("CfgData").gameName + "-房间号：" + mjDataMgr.get(mjDataMgr.KEYS.ROOMID);
        require("JSPhoneWeChat").WxShareFriend(info);
    },

    onEveryOneReady : function(){
        var self = this;
        var moveAct = cc.moveTo(0.3, cc.p(0, -800));
        this.readyN.runAction(cc.sequence(moveAct, cc.callFunc(function(){
            self.readyN.active = false;
            self.reportTipsN.active = false;
        })))
    },

    onBtnDissolveClicked : function () {
        let mjVotingUi = cc.instantiate(this.mjVotingUIP);
        mjVotingUi.parent = cc.director.getScene().getChildByName('Canvas');
        mjVotingUi.getComponent("mjVotingUI").setTips("确定解散房间？");
    },

    onBtnExitClicked : function () {
        let mjVotingUi = cc.instantiate(this.mjVotingUIP);
        mjVotingUi.parent = cc.director.getScene().getChildByName('Canvas');
    },

    //准备
    onBtnReadyClicked : function(){
         require("Audio").playEffect("hall", "button_nomal.mp3");
        // // this.readyN.getChildByName('btnUnReady').active = true;
        this.prepareToPlay();
    }, 

    //取消准备
    onBtnUnReadyClicked : function(){
        require("Audio").playEffect("hall", "button_nomal.mp3");
        // this.unPrepareToPlay();
    }, 

    refreRoomData : function(){
        var roomInfo = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO);
        this.initUI(roomInfo);
        //set room id
        var centerN  = this.readyN.getChildByName("center");
        var roomIdN  = centerN.getChildByName("roomNumber").getChildByName('content');
        var roomInfoN= centerN.getChildByName("info");
        roomIdN.getComponent(cc.Label).string = mjDataMgr.get(mjDataMgr.KEYS.ROOMID);
        //set room type list
        var roomShowList = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO).showList;
        this.typeConentN.children.forEach(function(child){
            child.active = false;
        })
        this.typeConentN.height = roomShowList.length * 50;
        roomShowList.forEach(function(itemData, index){
            let itemN    = this.typeConentN.getChildByName("item_"+index);
            itemN.active = true
            let nameN    = itemN.getChildByName("title").getChildByName("name");
            let contentN = itemN.getChildByName("content");
            nameN.getComponent(cc.Label).string    = itemData.name;
            contentN.getComponent(cc.Label).string = itemData.content;
        }.bind(this))
        this.refreBtnReady();
    },

    refreBtnReady : function(){
        var mdIdx        = mjDataMgr.get(mjDataMgr.KEYS.SELFID);
        var mePlayerData = mjDataMgr.getInstance().getPlayerData(mdIdx);
        var isReady      = (mePlayerData.Status === GameDefine.PLAYER_READY.READY)
        this.readyN.getChildByName('btnReady').active = !isReady; 
    },

    hideRoomOptBtn : function(){
        this.readyN.getChildByName("btnDissolve").active = false;
        this.readyN.getChildByName("btnOut").active      = false;
        this.readyN.getChildByName('btnInvite').active   = false; 
        // this.prepareToPlay();
    },


    checkCanReady : function(){
        var mdIdx        = mjDataMgr.get(mjDataMgr.KEYS.SELFID);
        var mePlayerData = mjDataMgr.getInstance().getPlayerData(mdIdx);
        var isNoCard    = (mePlayerData.Status === GameDefine.PLAYER_READY.NO_CARD);
        if(isNoCard){
            // var text = "您拥有的房卡数量少于房间所需数量";
            // NetMessageMgr.showTips(text);
        }
        return !isNoCard;
    },

    /*-----------------------------  Server Message -------------------------*/
    prepareToPlay : function () {
        if(!this.checkCanReady()){return}
        var content = {};
        content.PlayerID = mjDataMgr.get(mjDataMgr.KEYS.UID);
        
        mjNetMgr.cSend("gotoReady", content, function(rsp){
            if(rsp.RetCode == 0){
                // this.readyN.getChildByName('btnReady').active = false; 
            }
        }.bind(this));
    },

    dissolvedRoom : function () {
        var content    = {roomID: mjDataMgr.get(mjDataMgr.KEYS.ROOMID)}
        mjNetMgr.cSend("dissolvedRoom", content);
    },

    exitOutRoom : function(){
        var content    = {}
        content.roomID = mjDataMgr.get(mjDataMgr.KEYS.ROOMID);
        mjNetMgr.cSend("exitOutRoom", content, function(rsp){
            if(rsp.Leave){
               gameManager.exiteRoom(); 
            }
        });
    },
    //取消准备
    unPrepareToPlay : function(argument) {

    },

    /*-----------------------------  End -----------------------------------*/

});
