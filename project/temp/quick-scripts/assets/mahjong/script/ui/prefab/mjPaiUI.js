(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/ui/prefab/mjPaiUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cf789vRTClG47F5WMshaagb', 'mjPaiUI', __filename);
// mahjong/script/ui/prefab/mjPaiUI.js

"use strict";

// var utils         = require("utils");
var log = cc.log;
var normalColor = new cc.Color(255, 255, 255);
var caiShengColor = new cc.Color(233, 217, 177);
var chooseColor = new cc.Color(255, 185, 249);
var GameDefine = require("mjGameDefine");
var mjDataMgr = require("mjDataMgr");

cc.Class({
    extends: cc.Component,

    properties: {
        paiAltas: cc.SpriteAtlas,
        pai3dAltas: cc.SpriteAtlas
    },

    // use this for initialization

    init: function init() {
        var paiInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        // if(this.shouN){return}
        this.shouN = this.node.getChildByName("shou");
        this.pengN = this.node.getChildByName("peng");
        this.pengByN = this.node.getChildByName("pengBy");
        this.endN = this.node.getChildByName("end");
        this.gaiN = this.node.getChildByName("gai");
        this.gaiShouN = this.node.getChildByName("gaiShou");
        this.newTagN = this.node.getChildByName("newTag");
        this.effectZoneN = this.node.getChildByName("effect");

        var _norScale = mjDataMgr.get(mjDataMgr.KEYS.CFG).paiScale || 1;
        var paiScale = paiInfo.curScale || _norScale;
        this.node.scale = paiScale;
        // this.shouN.scale    = paiScale;
        // this.pengN.scale    = paiScale;
        // this.pengByN.scale  = paiScale;
        // this.gaiShouN.scale = paiScale;
        // this.gaiN.scale     = paiScale;
        var ShowType = GameDefine.PAISHOWTYPE;
        var nodeList = {};
        nodeList[ShowType.PENGBY] = this.pengByN;
        nodeList[ShowType.PENG] = this.pengN;
        nodeList[ShowType.SHOU] = this.shouN;
        nodeList[ShowType.END] = this.endN;
        nodeList[ShowType.GAI] = this.gaiN;
        nodeList[ShowType.SHOUGAI] = this.gaiShouN;
        this.TypeNodeList = nodeList;
    },

    initPaiSprite: function initPaiSprite(pai) {
        // this.init()
        // this.setContentSpite(this.shouN, pai);
        // this.setContentSpite(this.pengN, pai);
        // this.setContentSpite(this.endN, pai);
        // this.setContentSpite(this.pengByN, pai);
        // this.refresh(pai);
    },

    // setContentSpite: function(fNode, pai){
    //     this.pai = pai;
    //     this.refreshPaiNode(fNode, pai)
    // },

    refreshPaiNode: function refreshPaiNode(item, pai) {
        var paiInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var contentN = item.getChildByName("content");
        if (contentN) {
            contentN.getComponent(cc.Sprite).spriteFrame = this.getPaiSprite(pai.getLocalId()); //pai.paiSprite;
            contentN.skewX = paiInfo.skewX || 0;
            contentN.skewY = paiInfo.skewY || 0;
            contentN.scale = paiInfo.sfScale || 1;
            if (paiInfo.contentPos) {
                contentN.setPosition(paiInfo.contentPos);
            }
        }
        var caishengN = item.getChildByName("caisheng");
        var caishen3DN = item.getChildByName("caisheng3d");
        if (caishengN) {
            caishengN.active = pai.isCaiShen && !paiInfo.is3DView;
        }
        if (caishen3DN) {
            caishen3DN.active = pai.isCaiShen && paiInfo.is3DView;
        }
        var bgN = item.getChildByName("bg");
        if (bgN) {
            bgN.color = pai.isMagic ? caiShengColor : normalColor;
            if (paiInfo.bgFrameName) {
                var sf = this.getSpriteByInfo(paiInfo).getSpriteFrame(paiInfo.bgFrameName);
                bgN.getComponent(cc.Sprite).spriteFrame = sf;
                bgN.width = sf.getRect().width;
                bgN.height = sf.getRect().height;
            }
        }
    },

    getPaiSprite: function getPaiSprite(paiID) {
        // var mjDataMgr = require("mjDataMgr")
        var spriteName = "pj_" + paiID; //mjDataMgr.getInstance().getLocalPaiID(paiID);
        var spriteFrame = this.paiAltas.getSpriteFrame(spriteName);
        return spriteFrame;
    },

    refresh: function refresh(pai, paiInfo) {
        this.init(paiInfo);
        this.pai = pai;
        this.hideAll();
        this.curPaiNode = this.TypeNodeList[pai.showType];
        this.curPaiNode.active = true;
        this.refreshPaiNode(this.curPaiNode, pai, paiInfo);
        this.newTagN.active = pai.isChuPai;
        this.curBgColor = pai.isMagic ? caiShengColor : normalColor;
    },

    hideAll: function hideAll() {
        for (var type in this.TypeNodeList) {
            this.TypeNodeList[type].active = false;
        }
    },


    showSamePaiTips: function showSamePaiTips(paiID) {
        var isChoose = paiID == this.pai.id;
        var curBgNode = this.curPaiNode.getChildByName("bg");
        if (curBgNode) {
            curBgNode.color = isChoose ? chooseColor : this.curBgColor;
        }
    },

    addEffect: function addEffect(effNode, huTag) {
        this.effectZoneN.active = true;
        if (huTag == "dp") {
            this.effectZoneN.getChildByName("dp").addChild(effNode);
        } else if (huTag == "hu") {
            this.effectZoneN.getChildByName("hu").addChild(effNode);
        }
    },

    setPengBgColor: function setPengBgColor(color) {
        if (this.curPaiNode.getChildByName("bg")) {
            this.curPaiNode.getChildByName("bg").color = color;
        }
    },

    getSpriteByInfo: function getSpriteByInfo(paiInfo) {
        if (!paiInfo.is3DView) {
            return this.paiAltas;
        } else {
            return this.pai3dAltas;
        }
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
        //# sourceMappingURL=mjPaiUI.js.map
        