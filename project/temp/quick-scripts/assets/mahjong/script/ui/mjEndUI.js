(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/ui/mjEndUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '881eeAP2D1OFZJWSBDTOtop', 'mjEndUI', __filename);
// mahjong/script/ui/mjEndUI.js

"use strict";

// var utils      = require("utils");
var GameDefine = require("mjGameDefine");
var gameManager = require("mjGameManager");
////var Audio.      = require("Audio");
var mjDataMgr = require("mjDataMgr");
var log = cc.log;
// var FromPhone  = require("FromPhone");
var mjPai = require("mjPai");

cc.Class({
    extends: cc.Component,

    properties: {
        endRoundN: cc.Node,
        singleRoundN: cc.Node,
        totalRoundN: cc.Node,
        paiPrefab: cc.Prefab,
        btnContiuneN: cc.Node,
        timeL: cc.Label,
        sRoomNumL: cc.Label,
        tRoomNumL: cc.Label,
        singleShareN: cc.Node,
        totalShareN: cc.Node,
        gameNameL: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initDirectData();
        this.initSingleReport();
        this.initTotalReporte();
        this.endRoundN.active = false;
        this.singleRoundN.active = false;
        this.totalRoundN.active = false;
        var roomID = mjDataMgr.get(mjDataMgr.KEYS.ROOMID);
        this.sRoomNumL.string = roomID;
        this.tRoomNumL.string = roomID;
        this.gameNameL.string = mjDataMgr.get("CfgData").gameName;
        this.curPaiScale = 0.8;
        this.singleShareN.active = !(fun.gameCfg.releaseType === gameConst.releaseType.apple);
        this.totalShareN.active = !(fun.gameCfg.releaseType === gameConst.releaseType.apple);
        this.animation = this.endRoundN.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },

    initDirectData: function initDirectData() {
        var DirectType = GameDefine.DIRECTION_TYPE;
        var directNodeName = {};
        directNodeName[0] = { nodeName: "dong", localText: "东风" };
        directNodeName[1] = { nodeName: "nan", localText: "南风" };
        directNodeName[2] = { nodeName: "xi", localText: "西风" };
        directNodeName[3] = { nodeName: "bei", localText: "北风" };
        this.directNodeName = directNodeName;
    },

    initTotalReporte: function initTotalReporte() {
        var self = this;
        this.totalRoundN.refreshData = function (data) {
            var timeL = self.totalRoundN.getChildByName("time").getChildByName("content").getComponent(cc.Label);
            timeL.string = fun.utils.getCurTime();
            for (var _i = 0; _i < 4; _i++) {
                self.totalRoundN.getChildByName("player_" + _i).active = false;
            }
            var nodeIndex = -1;
            for (var k in data.players) {
                nodeIndex += 1;
                var itemData = data.players[k];
                var playerNode = self.totalRoundN.getChildByName("player_" + nodeIndex);
                playerNode.active = true;
                var winerN = playerNode.getChildByName("winner");
                var normalN = playerNode.getChildByName("normal");
                // 2018/3/5 美术修改，个人觉得比以前丑，可能还要修改，先保留之前的吧
                // itemData.playerData.isSelfPlayed = true;
                var isSelfPlayed = itemData.playerData.isSelfPlayed;
                self.setPlayerInfo(winerN, itemData.playerData);
                self.setPlayerInfo(normalN, itemData.playerData);
                winerN.active = itemData.isBigWiner;
                normalN.active = !itemData.isBigWiner;

                var detailN = playerNode.getChildByName("detail");
                detailN.children.forEach(function (item, index) {
                    item.active = index < itemData.detail.length;
                });
                for (var _k = 0; _k < itemData.detail.length; _k++) {
                    var itemNode = detailN.getChildByName("item_" + _k);
                    var nameL = itemNode.getChildByName("name").getComponent(cc.Label);
                    var contentN = itemNode.getChildByName("content");
                    var contentL = contentN.getComponent(cc.Label);
                    nameL.string = itemData.detail[_k].name;
                    contentL.string = itemData.detail[_k].value;
                    contentN.color = isSelfPlayed ? new cc.Color(233, 39, 19) : new cc.Color(147, 50, 40);
                }
                var scoreN = playerNode.getChildByName("totalScore");
                var scoreAddNode = scoreN.getChildByName("score_add");
                var scoreRedNode = scoreN.getChildByName("score_red");
                scoreAddNode.active = itemData.hasWin;
                scoreRedNode.active = !itemData.hasWin;
                scoreAddNode.getComponent(cc.Label).string = itemData.winCount;
                scoreRedNode.getComponent(cc.Label).string = itemData.winCount;

                var cardN = playerNode.getChildByName("card");
                var leftL = cardN.getChildByName("left").getComponent(cc.Label);
                var speedL = cardN.getChildByName("speed").getComponent(cc.Label);
                leftL.string = itemData.Left;
                speedL.string = itemData.Spend;
                // if(winerN.isBigWiner){
                //     var animanager = winerN.getComponent(cc.Animation);
                //     animanager.playAdditive("bigwiner");
                // }
            }
            self.resultVoice = data.meIsWiner ? "win.mp3" : "fail.mp3";
            self.checkEndMusic();
        };
    },

    initBtnContiune: function initBtnContiune() {
        var gameReplayMgr = require("mjReplayMgr");
        var disName = "继 续";
        if (!this.isCanContinue()) {
            disName = "总结算";
        }
        if (gameReplayMgr.isReplayPai()) {
            disName = "退 出";
        }
        var content = this.btnContiuneN.getChildByName("content");
        content.getComponent(cc.Label).string = disName;
    },

    initSingleReport: function initSingleReport() {
        var self = this;
        this.singleRoundN.refreshData = function (data) {
            self.timeL.string = fun.utils.getCurTime();
            self.setSingleWin(self.singleRoundN, data);
            for (var k = 0; k < 4; k++) {
                var playerNode = self.singleRoundN.getChildByName("player_" + k);
                var itemData = data[k];
                playerNode.active = itemData;
                if (itemData) {
                    var paiListN = playerNode.getChildByName("paiList");
                    var fanPaiListN = playerNode.getChildByName("fanList");
                    var dirNode = playerNode.getChildByName("direct");
                    self.setPlayerInfo(playerNode, itemData.playerData, true);
                    self.setDirectData(dirNode, itemData.player);
                    self.setFanAndHuCount(playerNode, itemData);
                    self.setHuCountData(playerNode, itemData);
                    self.setPaiData(paiListN, itemData);
                    self.setPaiFengScore(playerNode, itemData);
                    self.setReportTag(playerNode, itemData);
                    self.setFanPaiList(fanPaiListN, itemData);
                    playerNode.getChildByName("byTips").active = itemData.isby;
                }
            }
        };
        this.singleRoundN.cleanData = function () {
            for (var _i2 = 0; _i2 < 4; _i2++) {
                var playerNode = self.singleRoundN.getChildByName("player_" + _i2);
                var paiListN = playerNode.getChildByName("paiList");
                paiListN.removeAllChildren();
            }
        };
    },

    setSingleWin: function setSingleWin(singleRoundN, data) {
        var titleN = singleRoundN.getChildByName("title");
        var winN = titleN.getChildByName("win");
        var faileN = titleN.getChildByName("fail");
        faileN.active = !data.meIsWiner;
        winN.active = data.meIsWiner; //2018/3/5 美术决定不显示赢家ui
    },


    //player base info, icon/name/direction
    setPlayerInfo: function setPlayerInfo(playerNode, playerData, hasMore) {
        var iconN = playerNode.getChildByName("icon");
        fun.utils.loadUrlRes(playerData.Icon, iconN);
        var nameN = playerNode.getChildByName("name");

        nameN.getComponent(cc.Label).string = playerData.showName;
        if (hasMore) {
            var name1N = playerNode.getChildByName("name1");
            name1N.getComponent(cc.Label).string = playerData.showName;
            nameN.active = !playerData.isSelfPlayed;
            name1N.active = playerData.isSelfPlayed;
            iconN.getChildByName("border").active = !playerData.isSelfPlayed;
            iconN.getChildByName("border1").active = playerData.isSelfPlayed;
        }
        var idN = playerNode.getChildByName("id");
        if (idN) {
            idN.getComponent(cc.Label).string = "ID:" + playerData.UserId;
        }
        playerNode.getChildByName("bg1").active = playerData.isSelfPlayed; //true;
        playerNode.getChildByName("bg2").active = !playerData.isSelfPlayed; //false;
    },

    //hupai  dianpao  baoyuan lazi
    setReportTag: function setReportTag(playerNode, data) {
        var resultTagN = playerNode.getChildByName("resultTag");
        resultTagN.getChildByName("hu").active = data.ishu;
        resultTagN.getChildByName("lazi").active = data.islz;
        resultTagN.getChildByName("zm").active = data.iszm;
        resultTagN.getChildByName("by").active = data.isby;
        resultTagN.getChildByName("dp").active = !data.isby && data.isdp;

        playerNode.getChildByName("bgFaile").active = true; //!(data.ishu || data.iszm);
        playerNode.getChildByName("bg_win").active = false; //(data.ishu || data.iszm);
    },

    //fanshu  and hushu
    setFanAndHuCount: function setFanAndHuCount(playerNode, itemData) {
        var fanNode = playerNode.getChildByName("fanCount");
        var huNode = playerNode.getChildByName("huCount");
        fanNode.getComponent(cc.RichText).string = itemData.fanData;
        huNode.getComponent(cc.RichText).string = itemData.huData;
    },


    //xiangdui hushu  and  juedui hushu
    setHuCountData: function setHuCountData(playerNode, data) {
        data = data || {};
        var jdHuNode = playerNode.getChildByName("totalCount");
        jdHuNode.active = !data.islz;
        jdHuNode.getComponent(cc.Label).string = data.jdhs;
        var xdHuNodeAdd = playerNode.getChildByName("score_add"); //add 
        var xdHuNodeRed = playerNode.getChildByName("score_red"); //reduce
        var disXdhs = data.xdhs > 0 ? "+" + data.xdhs : data.xdhs;
        xdHuNodeAdd.active = data.xdhs > 0;
        xdHuNodeRed.active = !(data.xdhs > 0);
        xdHuNodeAdd.getComponent(cc.Label).string = disXdhs;
        xdHuNodeRed.getComponent(cc.Label).string = disXdhs;
    },

    //set current player direction data
    setDirectData: function setDirectData(dirNode, player) {
        dirNode.children.forEach(function (item) {
            item.active = false;
        });
        var nodeName = this.directNodeName[player.dirIndex].nodeName;
        dirNode.getChildByName(nodeName).active = true;
    },

    setFanPaiList: function setFanPaiList(fanPaiListN, itemData) {
        fanPaiListN.active = itemData.FanList != undefined;
        if (!itemData.FanList) {
            return;
        };
        var paiLen = 0;
        var pengGangHeng = 60 * mjDataMgr.get(mjDataMgr.KEYS.CFG).paiScale * this.curPaiScale;
        fanPaiListN.removeAllChildren();
        itemData.FanList.forEach(function (pai) {
            var paiNode = cc.instantiate(this.paiPrefab);
            paiNode.getComponent("mjPaiUI").refresh(pai);
            paiNode.setPosition(cc.p(paiLen, 0));
            paiNode.scale = paiNode.scale * this.curPaiScale;
            fanPaiListN.addChild(paiNode);
            paiLen += pengGangHeng;
        }.bind(this));
    },

    //set current player pai data
    setPaiData: function setPaiData(paiListNode, data) {
        var player = data.player;
        var pengGangPai = player.paiDataObj.pengGangPai;
        var gameReplayMgr = require("mjReplayMgr");
        var shouPai = data.shouPai;
        //every player's pai display as like xia player  
        var xiaType = GameDefine.DESKPOS_TYPE.XIA;

        var gangPaiList = pengGangPai.gang;
        var pengPaiList = pengGangPai.peng;
        var gangLen = 0;
        var pengLen = 0;
        var shouLen = 0;
        var pengGangHeng = 60 * mjDataMgr.get(mjDataMgr.KEYS.CFG).paiScale * this.curPaiScale;
        var pengGangZhi = 80 * mjDataMgr.get(mjDataMgr.KEYS.CFG).paiScale * this.curPaiScale;
        //gang
        for (var gIndex = 0; gIndex < gangPaiList.length; gIndex++) {
            var gang = gangPaiList[gIndex];
            var curLen = 0;
            var roindex = 0;
            for (var _i3 = 0; _i3 < 4; _i3++) {
                var _pai = gang[_i3];
                var paiNode = cc.instantiate(this.paiPrefab);
                paiNode.getComponent("mjPaiUI").refresh(_pai);
                paiNode.scale = paiNode.scale * this.curPaiScale;
                if (_i3 < 3) {
                    paiNode.setPosition(cc.p(gangLen + curLen, 0));
                    roindex = _pai.showType == GameDefine.PAISHOWTYPE.PENGBY ? _i3 : roindex;
                    var addLen = _pai.showType == GameDefine.PAISHOWTYPE.PENGBY ? pengGangZhi : pengGangHeng;
                    curLen += addLen;
                }
                paiListNode.addChild(paiNode);
                if (_i3 == 3) {
                    var forPos = curLen - pengGangHeng * 2;
                    forPos = roindex != 0 ? forPos - pengGangZhi + pengGangHeng : forPos;
                    paiNode.setPosition(cc.p(gangLen + forPos, 6));
                }
            }
            gangLen += curLen + 2;
        }

        gangLen = gangLen > 0 ? gangLen + 6 : gangLen;
        //peng  chi
        for (var _gIndex = 0; _gIndex < pengPaiList.length; _gIndex++) {
            var peng = pengPaiList[_gIndex];
            var _curLen = 0;
            for (var _i4 = 0; _i4 < peng.length; _i4++) {
                var _pai2 = peng[_i4];
                var paiNode = cc.instantiate(this.paiPrefab);
                paiNode.getComponent("mjPaiUI").refresh(_pai2);
                paiNode.setPosition(cc.p(gangLen + pengLen + _curLen, 0));
                paiListNode.addChild(paiNode);
                paiNode.scale = paiNode.scale * this.curPaiScale;
                var addLen = _pai2.showType == GameDefine.PAISHOWTYPE.PENGBY ? pengGangZhi : pengGangHeng;
                _curLen += addLen;
            }
            pengLen += _curLen + 4;
        }
        pengLen = pengLen > 0 ? pengLen + 10 : pengLen;
        //shou shang pai 
        for (var _i5 = 0; _i5 < shouPai.length; _i5++) {
            var pai = shouPai[_i5];
            var _paiNode = cc.instantiate(this.paiPrefab);
            _paiNode.getComponent("mjPaiUI").refresh(pai);
            _paiNode.setPosition(cc.p(gangLen + pengLen + shouLen, 0));
            paiListNode.addChild(_paiNode);
            _paiNode.scale = _paiNode.scale * this.curPaiScale;
            shouLen += pengGangHeng;
        }
        //hupai
        // if(data.ishu){
        if (data.ishu || data.iszm) {
            var _paiNode2 = cc.instantiate(this.paiPrefab);
            var pai = mjPai.new(data.hp); //{id : data.hp, rotate : 0};
            pai.setShowType(GameDefine.PAISHOWTYPE.PENG);
            _paiNode2.getComponent("mjPaiUI").refresh(pai);
            _paiNode2.scale = this.curPaiScale;
            _paiNode2.setPosition(cc.p(gangLen + pengLen + shouLen + 20, 0));
            _paiNode2.getComponent("mjPaiUI").setPengBgColor(new cc.Color(255, 206, 206));
            paiListNode.addChild(_paiNode2);
        }
    },

    //和其他风玩家的分数
    setPaiFengScore: function setPaiFengScore(playerNode, infoData) {
        var pIndex = infoData.player.dirIndex;
        //2018/3/5 美术决定只显示一种颜色
        var addColor = new cc.Color(180, 160, 122); //new cc.Color(211, 200, 28);
        var reduceColor = new cc.Color(180, 160, 122); //new cc.Color(25, 167, 219);
        var nodeIndex = 0;
        for (i = 0; i < 4; i++) {
            if (i == pIndex) {
                continue;
            }
            var fengNode = playerNode.getChildByName("feng_" + nodeIndex);
            var nameNode = fengNode.getChildByName("name");
            var scoreNode = fengNode.getChildByName("content");
            nodeIndex += 1;
            var score = infoData.Scores[i] || 0;
            nameNode.getComponent(cc.Label).string = this.directNodeName[i].localText;
            scoreNode.getComponent(cc.Label).string = score;
            scoreNode.color = score > 0 ? addColor : reduceColor;
        }
    },

    showSingleReport: function showSingleReport() {
        this.show();
        this.singleRoundN.active = true;
        require("Audio").playEffect("mahjong", "result.mp3");
    },
    show: function show() {
        this.endRoundN.active = true;
        this.animation.play(this.clips[0].name);
    },
    close: function close() {
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.endRoundN.active = false;
            this.singleRoundN.active = false;
            this.totalRoundN.active = false;
        }, this);
    },
    hideSingleReport: function hideSingleReport() {
        this.singleRoundN.active = false;
        this.singleRoundN.cleanData();
    },


    showTotalReport: function showTotalReport() {
        this.show();
        this.hideSingleReport();
        this.totalRoundN.active = true;
        this.checkEndMusic();
    },

    checkEndMusic: function checkEndMusic() {
        if (!this.totalRoundN.active || !this.resultVoice) {
            return;
        }
        require("Audio").playEffect('mahjong', this.resultVoice);
        require("Audio").stopMusic();
    },


    //cur round report data
    setSingleReportData: function setSingleReportData(reportData, gameUI) {
        this.gameUI = gameUI;
        this.singleRoundN.refreshData(reportData);
        this.initBtnContiune();
    },

    setTotalReportData: function setTotalReportData(reportData, gameUI) {
        this.gameUI = gameUI;
        this.totalReportData = reportData;
        this.totalRoundN.refreshData(this.totalReportData);
    },

    onBtnClose: function onBtnClose() {
        this.endRoundN.active = false;
        this.singleRoundN.active = false;
        this.totalRoundN.active = false;
        this.resultVoice = undefined;
    },

    onBtnExitClicked: function onBtnExitClicked() {
        require("Audio").playEffect("hall", "button_nomal.mp3");
        gameManager.cleanPlayerPaiData();
        gameManager.exiteRoom();
    },

    //share single report to other
    onBtnSingleShare: function onBtnSingleShare() {
        require("Audio").playEffect("hall", "button_nomal.mp3");
        require("JSPhoneWeChat").WxShareFriendScreen();
    },

    //share total report to other
    onBtnTotalShare: function onBtnTotalShare() {
        require("Audio").playEffect("hall", "button_nomal.mp3");
        require("JSPhoneWeChat").WxShareFriendScreen();
    },

    onBtnContiuneClicked: function onBtnContiuneClicked() {
        var gameReplayMgr = require("mjReplayMgr");
        if (gameReplayMgr.isReplayPai()) {
            this.onBtnExitClicked();
            return;
        }
        require("Audio").playEffect("hall", "button_nomal.mp3");
        this.hideSingleReport();
        if (this.isCanContinue()) {
            this.gotoReadyUI();
        } else {
            this.showTotalReport();
        }
    },

    gotoReadyUI: function gotoReadyUI() {
        gameManager.cleanPlayerPaiData();
        this.gameUI.lunpanN.active = false;
        this.gameUI.hideRoomOptBtn();
        this.gameUI.startReady();
        this.close();
    },

    //是否还能继续打牌
    isCanContinue: function isCanContinue() {
        return this.totalReportData === undefined;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=mjEndUI.js.map
        