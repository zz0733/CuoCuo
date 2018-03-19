var log             = cc.log;
var GameDefine      = require("mjGameDefine");
var mjNetMgr        = require("mjNetMgr");
var mjDataMgr       = require("mjDataMgr");
var gameManager     = require("mjGameManager");

cc.Class({
    extends: cc.Component,

    properties: {
       btnVoiceN    : cc.Node,
       btnChatN     : cc.Node,
       interactP    : cc.Prefab,
       chatP        : cc.Prefab,
       playerDetailP: cc.Prefab,
       popWindowN   : cc.Node,
       playerMap  : cc.Prefab,

    },

    // use this for initialization
    onLoad: function () {
        this.initMessage();
        this.initPlayerDetail();
    },

    start(){
        var isAppleVer = (fun.gameCfg.releaseType === gameConst.releaseType.apple);
        var isReplay   = require("mjReplayMgr").isReplayPai();
        this.btnVoiceN.active = cc.sys.isNative && !isReplay && !isAppleVer;//just phone can use 
        this.btnChatN.active  = !isReplay && !isAppleVer;
    },

    initMessage : function(){
        fun.event.add("mjPlayerDetail", "mjPlayerDetail", this.showPlayerInfo.bind(this))
        fun.event.add("mjRoomChat", "RoomChat", this.playerChat.bind(this))
        fun.event.add("mjRoomChatV", "RoomChatVoice", this.showPlayerVoice.bind(this));
        mjNetMgr.getIns().addChatNet(mjNetMgr.KEYS.CHAT, this);
    },

    cleanMessage : function(){
        fun.event.remove("mjPlayerDetail");
        fun.event.remove("mjRoomChat");
        fun.event.remove("mjRoomChatV");
        mjNetMgr.getIns().rmNet(mjNetMgr.KEYS.CHAT);
    },

    update : function(dt){
    },

    onDestroy : function(){
        this.cleanMessage();
    },

    showPlayerInfo(pData){
        var detailN       = cc.instantiate(this.playerDetailP);
        var playerData    = pData.d;
        var deskType      = pData.pos
        var data          = {name : playerData.showName, id : "ID:"+playerData.UserId, url : playerData.Icon};
        data.addr         = (playerData.Address) ? playerData.Address.locdesc : "未开启定位";//"离你999.2km";
        data.isNoLocation = false;
        data.isSelf       = deskType  == GameDefine.DESKPOS_TYPE.XIA;
        data.selfUid      = mjDataMgr.get(mjDataMgr.KEYS.UID);
        data.curUid       = playerData.UserId;
        detailN.getComponent("playerDetailUI").show(data, this.showPlayerMap.bind(this));
        cc.log("this.PlayerDetailPos[deskType]", this.PlayerDetailPos[deskType]);
        detailN.setPosition(this.PlayerDetailPos[deskType]);
        this.popWindowN.addChild(detailN);
    },

    initPlayerDetail : function(){
        var deskType            = GameDefine.DESKPOS_TYPE;
        var posList             = {};
        posList[deskType.SHANG] = cc.p(135, 180);
        posList[deskType.ZUO]   = cc.p(-360, 120);
        posList[deskType.YOU]   = cc.p(360, 135);
        posList[deskType.XIA]   = cc.p(-360, -135);
        this.PlayerDetailPos    = posList;
    },

    playerChat(data){
        if(data.chatType == "interact"){
            this.showInteract(data);
        }else {
            if(data.chatType != "voice"){
                var player = gameManager.getplayerByUserID(data.from);
                player.showChat(data);
            }
        }
    },

    showPlayerVoice(data){
        var player = gameManager.getplayerByUserID(data.from);
        player.showChat(data);
    },


    onBtnChatClicked(){
        require("Audio").playEffect("hall", "button_nomal.mp3");
        this.popWindowN.addChild( cc.instantiate(this.chatP) );
    },


    showInteract(data){
        var sPlayer   = gameManager.getplayerByUserID(data.from);
        var ePlayer   = gameManager.getplayerByUserID(data.to);
        var interactN = cc.instantiate(this.interactP);
        this.popWindowN.addChild(interactN);
        interactN.getComponent("interact").show(data, sPlayer.getInteractPos(), ePlayer.getInteractPos());
    },

    showPlayerMap(){
        var mapN = cc.instantiate(this.playerMap);
        this.popWindowN.addChild(mapN)
        mapN.getComponent("playerMap").show(mjDataMgr.get(mjDataMgr.KEYS.PLAYERS));
    },
})
