"use strict";
cc._RF.push(module, '996c1bIhUhPU7TgprP4fv4Z', 'mjPaijuMgr');
// mahjong/script/game/paiju/mjPaijuMgr.js

"use strict";

// var utils = require("utils");
var log = cc.log;

/////////////////////////////// start  //////////////////////////////////////////////////////////

var UIControlData = function UIControlData() {

    this.superInitRound = function () {
        this.showLen = 0;
        this.pengGangLen = 0;
    };

    this.initPaiNode = function (playerUI) {
        this.totalPaiPool = 20; //the number of  paiNode in pool;
        this.playerUI = playerUI;
        var paiListNode = playerUI.paiListNode;
        this.pengGangPaiN = paiListNode.getChildByName('pengGang');
        this.shouPaiN = paiListNode.getChildByName("shouPai");
        this.dachuPaiN = paiListNode.getChildByName("dachuPai");
        this.faPaiAnimN = paiListNode.getChildByName("shouAnim");
        this.buhuaPaiN = paiListNode.getChildByName("buHua");
        this.gameUI = playerUI.gameUI;
        this.pengStartPos = this.pengGangPaiN.getPosition();
        this.paiListNode = paiListNode;
        this.setNodePool(playerUI.eyeType);
        this.init(paiListNode);
        var showType = require("mjGameDefine").PAISHOWTYPE;
        var zoneList = {};
        zoneList[showType.GAI] = this.pengGangHeng;
        zoneList[showType.SHOU] = this.shouWidth;
        zoneList[showType.END] = this.ENDWidth;
        zoneList[showType.PENG] = this.pengGangHeng;
        zoneList[showType.PENGBY] = this.pengGangZhi;
        zoneList[showType.SHOUGAI] = this.shouWidth;
        this.paiZoneList = zoneList;
    };

    this.getPaiPrefabByView = function (eyeType) {
        var paiPrefab = this.playerUI.pai2DPrefab;
        if (eyeType == "3d") {
            paiPrefab = this.playerUI.pai3DPrefab;
        }
        return paiPrefab;
    };

    this.setNodePool = function (eyeType) {
        this.cleanNodePool();
        this.eyeType = eyeType;
        var paiPrefab = this.getPaiPrefabByView(eyeType);
        this.paiPoolList = new cc.NodePool();
        for (var i = 0; i < this.totalPaiPool; i++) {
            var paiNode = cc.instantiate(paiPrefab);
            this.paiPoolList.put(paiNode);
        }
        this.curPaiPrefab = paiPrefab;
    };

    this.getPaiNode = function (pai) {
        var paiNode;
        if (this.paiPoolList.size() > 0) {
            paiNode = this.paiPoolList.get();
            paiNode.isIns = false;
        } else {
            paiNode = cc.instantiate(this.curPaiPrefab);
            paiNode.isIns = true;
        }
        paiNode.name = pai.udid;
        paiNode.defaultPos = paiNode.defaultPos || paiNode.getPosition();
        paiNode.setPosition(paiNode.defaultPos);
        paiNode.pai = pai;
        paiNode.active = true;
        paiNode.instance = this;
        return paiNode;
    };

    this.putPaiNode = function (paiNode) {
        if (this.OutPaiNode && paiNode == this.OutPaiNode) {
            delete this.OutPaiNode;
        }
        paiNode.active = false;
        if (paiNode.isIns) {
            paiNode.removeFromParent();
        } else {
            this.paiPoolList.put(paiNode);
        }
    };

    this.cleanNodePool = function (curPaiPrefab) {
        if (this.paiPoolList) {
            this.paiPoolList.clear();
        }
    };

    this.onDestroy = function () {
        this.cleanNodePool();
        if (this._OnDestroy) {
            this._OnDestroy();
        }
    };

    this.checkPaiNode = function (parentN, paiList) {
        var self = this;
        fun.utils.forEach(paiList, function (pai) {
            var paiNode = parentN.getChildByName(pai.udid);
            if (!paiNode) {
                paiNode = self.getPaiNode(pai);
                parentN.addChild(paiNode);
            }
            paiNode.getComponent("mjPaiUI").refresh(pai);
        });
    };

    this.addShouPai = function (addPai) {
        this.addShouPaiData(addPai, this.shouPaiN);
        this.refreShouPai();
    };

    this.addShouPaiData = function (addPai, targetN) {
        var self = this;
        fun.utils.forEach(addPai, function (pai, index) {
            var paiNode = self.getPaiNode(pai);
            if (self.addTouchEvent) {
                self.addTouchEvent(paiNode);
            }
            targetN.addChild(paiNode);
        });
    };

    this.addFaPai = function (addPai) {
        this.addShouPaiData(addPai, this.faPaiAnimN);
        this.refreFaPai();
    };

    this.moPai = function (pai) {
        var paiNode = this.getPaiNode(pai);
        this.shouPaiN.addChild(paiNode);
        if (this.addTouchEvent) {
            this.addTouchEvent(paiNode);
        }
        // this.shouLen = this.setShouPaiPos(paiNode, pai, this.shouLen, true, );
        var info = this.getShouPaiInfo(pai, this.shouLen, true, this.getPaiData().shouShangPai.length, paiNode);
        this.shouLen = info.shouLen;
        paiNode.getComponent("mjPaiUI").refresh(pai, info);
        paiNode.setPosition(info.pos);
        paiNode.setLocalZOrder(info.zOrder);
        this.refreRelativePos();
    };

    this.addOutPai = function (pai) {
        this.refreDachuPai();
    };

    this.updateBuHua = function () {
        this.refreBuhua();
    };

    this.refreBuhua = function () {
        this.checkPaiNode(this.buhuaPaiN, this.getPaiData().puhuaList);
        this.getPaiData().puhuaList.forEach(function (pai, index) {
            var paiNode = this.buhuaPaiN.getChildByName(pai.udid);
            var info = this.getBuhuaInfo(paiNode, index);
            paiNode.getComponent("mjPaiUI").refresh(pai, info);
            paiNode.setPosition(info.pos);
            paiNode.setLocalZOrder(info.zOrder);
        }.bind(this));
    };

    // this.refreshBuhUA = function()
    this.refreShouPai = function () {
        var shouPaiList = this.getPaiData().shouShangPai;
        this.shouLen = this.refreHandNode(shouPaiList, this.shouPaiN);
    };

    this.refreFaPai = function () {
        var faPaiList = this.getPaiData().faPaiList;
        this.refreHandNode(faPaiList, this.faPaiAnimN);
    };

    this.refreHandNode = function (paiList, handN) {
        var len = 0;
        fun.utils.forEach(paiList, function (pai, index) {
            var paiNode = handN.getChildByName(pai.udid);
            var info = this.getShouPaiInfo(pai, len, false, index, paiNode);
            paiNode.getComponent("mjPaiUI").refresh(pai, info);
            paiNode.setPosition(info.pos);
            paiNode.setLocalZOrder(info.zOrder);
            len = info.shouLen;
        }.bind(this));
        return len;
    };

    this.refreDachuPai = function () {
        var paiList = this.getPaiData().daPaiOutList;
        this.checkPaiNode(this.dachuPaiN, paiList);
        fun.utils.forEach(paiList, function (pai, index) {
            var paiNode = this.dachuPaiN.getChildByName(pai.udid);
            var info = this.getDachuInfo(index);
            paiNode.setPosition(info.pos);
            paiNode.getComponent("mjPaiUI").refresh(pai, info);
            paiNode.setLocalZOrder(info.zOrder);
        }.bind(this));
    };

    this.getPaiData = function () {
        return this.player.getPaiData.call(this.player);
    };

    this.initPlayer = function (player) {
        this.player = player;
    };

    this.refrePengGangPos = function () {
        var self = this;
        var GameDefine = require("mjGameDefine");
        fun.utils.forEach(this.getPaiData().pengGangPai.peng, function (item, index) {
            self.checkPaiNode(self.pengGangPaiN, item);
        });
        fun.utils.forEach(this.getPaiData().pengGangPai.gang, function (item, index) {
            self.checkPaiNode(self.pengGangPaiN, item);
        });
        var len = 0;
        var gangList = this.getPaiData().pengGangPai.gang;
        var pIndex = 0;

        gangList.forEach(function (item, index) {
            for (var i = 0; i < 4; i++) {
                var pai = item[i];
                var paiNode = self.pengGangPaiN.getChildByName(pai.udid);
                var info = self.getPengGangInfo(pai, len, i, pIndex);
                paiNode.setPosition(info.pos);
                paiNode.setLocalZOrder(info.zOrder);
                paiNode.getComponent("mjPaiUI").refresh(pai, info);
                len = info.len;
                //因为杠牌第三张牌是重叠在中间的牌上
                if (i != 3) {
                    pIndex += 1;
                }
            }
            len += self.is3DView ? self.gangDiff * 0.8 : self.gangDiff * self.paiScale;
        });
        var pengList = this.getPaiData().pengGangPai.peng;
        pengList.forEach(function (item, index) {
            for (var i = 0; i < 3; i++) {
                var pai = item[i];
                var paiNode = self.pengGangPaiN.getChildByName(pai.udid);
                var info = self.getPengGangInfo(pai, len, i, pIndex);
                paiNode.setPosition(info.pos);
                paiNode.setLocalZOrder(info.zOrder);
                paiNode.getComponent("mjPaiUI").refresh(pai, info);
                len = info.len;
                pIndex += 1;
            }
            len += self.is3DView ? self.gangDiff * 0.8 : self.gangDiff * self.paiScale;
        });
        this.pengGangLen = len;
        this.refreRelativePos();
    };

    this.onFaPaiStart = function () {
        this.shouPaiN.opacity = 0;
        this.pengGangPaiN.opacity = 0;
    };

    this.onFaPaiEnd = function () {
        this.shouPaiN.opacity = 255;
        this.pengGangPaiN.opacity = 255;
    };

    this.refreRelativePos = function () {
        this.removeNodeChild(this.faPaiAnimN);
        this.setShouRelativePos(this.pengGangLen, this.shouLen);
    };

    this.showSamePaiTips = function (paiID) {
        fun.utils.forEach(this.dachuPaiN.children, function (item) {
            item.getComponent("mjPaiUI").showSamePaiTips(paiID);
        });
        fun.utils.forEach(this.pengGangPaiN.children, function (item) {
            item.getComponent("mjPaiUI").showSamePaiTips(paiID);
        });
    };

    this.rmShouPai = function (pai) {
        var paiNode = this.shouPaiN.getChildByName(pai.udid);
        this.putPaiNode(paiNode);
        this.refreShouPai();
    };

    this.daPai = function (pai) {
        var self = this;
        var paiNode = this.shouPaiN.getChildByName(pai.udid);
        var worldPos = this.shouPaiN.convertToWorldSpaceAR(paiNode.getPosition());
        var localPos = this.dachuPaiN.convertToNodeSpaceAR(worldPos);
        this.putPaiNode(paiNode);
        var daPaiNode = this.getPaiNode(pai);
        pai.setShowType(require("mjGameDefine").PAISHOWTYPE.END);
        daPaiNode.getComponent("mjPaiUI").refresh(pai);
        daPaiNode.setPosition(localPos);
        this.dachuPaiN.addChild(daPaiNode);
        var posIndex = this.dachuPaiN.children.length - 1;
        var targetInfo = this.getDachuInfo(posIndex);
        var moveTime = cc.pDistance(localPos, targetInfo.pos) / 2000;
        var moveAct = cc.moveTo(moveTime, targetInfo.pos);
        var changeAct = cc.sequence(moveAct, cc.callFunc(function () {
            pai.isChuPai = true;
            daPaiNode.getComponent("mjPaiUI").refresh(pai, targetInfo);
            self.refreShouPai();
            self.refreDachuPai();
            self.playerUI.player.daPaiAnimEnd();
        }));
        daPaiNode.setLocalZOrder(999);
        daPaiNode.runAction(changeAct);
    };

    // this.

    this.pengGangPai = function (spliceList) {
        var self = this;
        fun.utils.forEach(spliceList, function (pai) {
            self.removePaiNode(self.shouPaiN, pai.udid);
        });
        this.refreShouPai();
        this.refrePengGangPos();
    };

    this.removePaiNode = function (targetN, udid) {
        var paiNode = targetN.getChildByName(udid);
        if (paiNode) {
            this.putPaiNode(paiNode);
        }
    };

    this.removeDachuPai = function (udid) {
        this.removePaiNode(this.dachuPaiN, udid);
    };
    this.removeShouPai = function (udid) {
        this.removePaiNode(this.shouPaiN, udid);
        this.refreShouPai();
    };

    this.removeNodeChild = function (rmNode) {
        var self = this;
        fun.utils.forEach(rmNode.children, function (item) {
            self.putPaiNode(item);
        });
        //浏览器这里有概率会报错
        if (rmNode && rmNode.children && rmNode.children.length) {
            rmNode.removeAllChildren();
        }
        rmNode._children = [];
    };

    this.removeAll = function () {
        this.removeNodeChild(this.shouPaiN);
        this.removeNodeChild(this.pengGangPaiN);
        this.removeNodeChild(this.dachuPaiN);
        this.removeNodeChild(this.buhuaPaiN);
    };

    this.showDpAnim = function (pai) {
        var dpNode = cc.instantiate(this.gameUI.dianpaoPrefab);
        var paiNode = this.dachuPaiN.getChildByName(pai.udid);
        paiNode.getComponent("mjPaiUI").addEffect(dpNode, "dp");
        paiNode.setLocalZOrder(999);
        dpNode.getComponent("mjDpaoUI").show(this, pai.udid);
    };

    this.rmZimoPai = function (udid) {
        this.removeShouPai(udid);
    };

    this.addHupai = function (pai) {
        // this.removeShouPai(pai.udid);
        pai.setShowType(require("mjGameDefine").PAISHOWTYPE.PENG);
        this.moPai(pai);
        var paiNode = this.shouPaiN.getChildByName(pai.udid);
        var animanager = paiNode.getComponent(cc.Animation);
        animanager.playAdditive("mjHuAnim");
        var huNode = cc.instantiate(this.gameUI.hupaiPrefab);
        paiNode.getComponent("mjPaiUI").addEffect(huNode, "hu");
        huNode.getComponent("mjHuAnimUI").show();
    };

    this.setPaiEnd = function (isEated, pai) {
        if (isEated) {
            this.removeDachuPai(pai.udid);
        } else {
            this.refreDachuPai();
            // var paiNode = this.dachuPaiN.getChildByName(pai.udid);
            // paiNode.getComponent("mjPaiUI").refresh(pai, );
        }
    };
};

module.exports = {
    init: function init() {
        var deskDefine = require("mjGameDefine").DESKPOS_TYPE;
        var deskList = {};
        deskList[deskDefine.XIA] = require("mjPaijuXia");
        deskList[deskDefine.SHANG] = require("mjPaijuShang");
        deskList[deskDefine.ZUO] = require("mjPaijuZuo");
        deskList[deskDefine.YOU] = require("mjPaijuYou");
        this.deskList = deskList;
    },

    newChild: function newChild(deskType) {
        if (!this.deskList) {
            this.init();
        }
        var child = this.deskList[deskType].instance;
        child.prototype = new UIControlData();
        return new child();
    }
};

cc._RF.pop();