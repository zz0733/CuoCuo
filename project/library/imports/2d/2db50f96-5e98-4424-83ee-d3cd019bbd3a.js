"use strict";
cc._RF.push(module, '2db50+WXphEJIPu080Bm706', 'mjPlayerUI');
// mahjong/script/ui/mjPlayerUI.js

"use strict";

var GameDefine = require("mjGameDefine");
var gameManager = require("mjGameManager");

cc.Class({
    extends: cc.Component,

    properties: {
        pai2DPrefab: cc.Prefab,
        pai3DPrefab: cc.Prefab
    },
    // use this for initialization
    onLoad: function onLoad() {},

    onDestroy: function onDestroy() {
        if (this.UIControl) {
            this.UIControl.onDestroy();
            this.UIControl = undefined;
        }
    },
    init: function init() {
        this.initNodeList();
        this.initChat();
    },
    initNodeList: function initNodeList() {
        this.paiListNode = this.node.getChildByName("paiNode");
        this.playerInfoN = this.node.getChildByName("info");
        this.chatN = this.node.getChildByName("chat");
        this.waitN = this.node.getChildByName("wait");
        this.statusTagN = this.playerInfoN.getChildByName("status");
        this.quanN = this.node.getChildByName("Quan");
        this.offLineNode = this.node.getChildByName("offLine");
        this.directN = this.node.getChildByName("direct");
        this.effectZoneN = this.node.getChildByName("effectZone");
        this.playerInfoN.on("touchend", this.onPlayerInfoClicked, this);
        this.chatN.active = true;
        this.playerInfoN.active = false;
        this.quanN.active = false;
        this.quanN.active = false;
        this.offLineNode.active = false;
        this.directN.active = false;
        this.totalDt = 0;
    },
    hideWaitName: function hideWaitName() {
        this.node.getChildByName("wait").getChildByName("label").active = false;
    },
    update: function update(dt) {
        this.totalDt += dt;
        if (this.totalDt > 1) {
            this.updateSecond();
            this.totalDt -= 1;
        }
    },
    updateSecond: function updateSecond() {
        this.chatN.updatTime();
    },


    initChat: function initChat() {
        this.hideAllChat();
        var handerList = {};
        handerList["emoji"] = this.showEmoji;
        handerList["text"] = this.showText;
        handerList["voice"] = this.showVoice;
        this.chatN.updatTime = function () {
            this.children.forEach(function (child) {
                child.time = child.time || 0;
                child.time -= 1;
                child.active = child.time > 0;
            });
        };
        this.handerList = handerList;
    },

    showChat: function showChat(data) {
        var hander = this.handerList[data.chatType];
        hander.call(this, data);
    },

    showEmoji: function showEmoji(data) {
        var emojiN = this.chatN.getChildByName("emoji");
        emojiN.active = true;
        var spAnim = emojiN.getComponent(sp.Skeleton);
        spAnim.setAnimation(0, data.content, true);
        emojiN.time = 4;
    },

    showText: function showText(data) {
        var textN = this.chatN.getChildByName("text");
        textN.active = true;
        var contentN = textN.getChildByName("content");
        contentN.getComponent(cc.Label).string = data.content;
        var Audio = require("Audio");
        var idx = data.index + 1 < 10 ? '0' + (data.index + 1) : data.index + 1;
        var talk = void 0,
            language = void 0,
            gameType = fun.db.getData('RoomInfo').GameType;
        var isWenLing = gameType === gameConst.gameType.maJiangWenLing ? true : false;
        var isMandarin = parseInt(fun.gameCfg.voiceLanguage) === gameConst.voiceLanguage.mandarin ? true : false;
        if (isWenLing) {
            if (isMandarin) {
                talk = '_talk1';
                language = 'mandarin';
            } else {
                language = 'wlmj';
                talk = '_talk0';
            }
        } else {
            talk = '_talk0';
            if (isMandarin) {
                language = 'mandarin';
            } else {
                language = 'hymj';
            }
        }
        var voiceName = talk + idx + '.mp3';
        var sex = require("mjDataMgr").getInstance().getPlayerData(this.player.PlayerIdx).Sex == 2 ? "female" : "male";
        var voicePath = language + '/' + sex + voiceName;
        Audio.playEffect('mahjong', voicePath);
        textN.time = 4;
    },

    showVoice: function showVoice(data) {
        var voiceN = this.chatN.getChildByName("voice");
        voiceN.active = true;
        voiceN.time = data.length || 2;
    },

    hideAllChat: function hideAllChat() {
        this.chatN.children.forEach(function (item, index) {
            item.active = false;
        });
    },

    addBuhua: function addBuhua(buhuaList) {
        this.UIControl.addBuhua(buhuaList);
    },

    refreshPlayerData: function refreshPlayerData(playerData) {
        this.playerInfoN.active = playerData !== undefined;
        this.waitN.active = playerData === undefined;
        if (!playerData) {
            return;
        };
        var nameNode = this.playerInfoN.getChildByName("name");
        var scoreNode = this.playerInfoN.getChildByName("sore");
        var scoreLabel = scoreNode.getChildByName("content").getComponent(cc.Label);
        scoreLabel.string = playerData.xdhs || 0;
        nameNode.getComponent(cc.Label).string = playerData.showName;
        var imgNode = this.playerInfoN.getChildByName("icon");
        fun.utils.loadUrlRes(playerData.Icon, imgNode);
    },

    refrePlayerStatus: function refrePlayerStatus(status) {
        var noCardN = this.statusTagN.getChildByName("noCard");
        var readyN = this.statusTagN.getChildByName("ready");
        readyN.active = status == GameDefine.PLAYER_READY.READY;
        noCardN.active = status == GameDefine.PLAYER_READY.NO_CARD;
        this.offLineNode.active = status === GameDefine.PLAYER_READY.OFFLINE;
    },

    refreGameStatus: function refreGameStatus(status) {
        this.quanN.active = status == GameDefine.TURN_STATUS.TURNTOPLAY;
    },


    setDirection: function setDirection(direction) {
        this.directN.active = direction == GameDefine.DIRECTION_TYPE.DONG;
        // this.directN.getChildByName("dong").active = (direction == DefineType.DONG);
        // this.directN.getChildByName("nan").active  = (direction == DefineType.NAN);
        // this.directN.getChildByName("xi").active   = (direction == DefineType.XI);
        // this.directN.getChildByName("bei").active  = (direction == DefineType.BEI);
    },

    cleanPaiNode: function cleanPaiNode() {
        this.UIControl.removeAll();
    },

    showHuPaiAnim: function showHuPaiAnim(pai, hupaiData) {
        this.showPaiEndAnim(hupaiData);
        this.UIControl.addHupai(pai);
    },

    showPaiEndAnim: function showPaiEndAnim(hupaiData) {
        var animNode = cc.instantiate(this.paiEffectPrefab);
        this.effectZoneN.addChild(animNode);
        animNode.getComponent("mjAnimHelper").showSpeacilEndAnim(hupaiData);
    },

    //初始化玩家的座位
    initDeskPosType: function initDeskPosType(deskType, gameUI, player, paijuUIMgr) {
        this.deskType = deskType;
        this.gameUI = gameUI;
        this.paiEffectPrefab = gameUI.optEffectPrefab;
        this.player = player;
        this.paijuUIMgr = paijuUIMgr;
        this.eatType = "2d";
        var mjPaijuMgr = require("mjPaijuMgr");
        this.UIControl = mjPaijuMgr.newChild(deskType);
        this.UIControl.initPaiNode(this);
    },


    initRound: function initRound() {
        this.cleanPaiNode();
        this.UIControl.initRound();
    },
    //显示玩家详情
    onPlayerInfoClicked: function onPlayerInfoClicked() {
        this.player.showPlayerInfo();
    },

    //刷新玩家的信
    showOptPaiAnim: function showOptPaiAnim(eatType) {
        var animNode = cc.instantiate(this.paiEffectPrefab);
        this.effectZoneN.addChild(animNode);
        animNode.getComponent("mjAnimHelper").showOptPaiAnim(eatType);
    },

    getInteractPos: function getInteractPos() {
        return this.playerInfoN.convertToWorldSpaceAR(cc.p(0, 0));
    },

    getPaiMgr: function getPaiMgr() {
        return this.UIControl;
    }
});

cc._RF.pop();