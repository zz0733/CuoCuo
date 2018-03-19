"use strict";
cc._RF.push(module, 'ebbf50agXZPTZHvwW91qnQt', 'mjPaijuXia');
// mahjong/script/game/paiju/mjPaijuXia.js

"use strict";

var mjDataMgr = require("mjDataMgr");
var log = cc.log;
/////////////////////////////// 下方玩家 //////////////////////////////////////////////////////////
var xiaControl = function xiaControl() {

    //---------------------new ----------------------------//
    this.init = function (paiListNode) {

        this.paiScale = mjDataMgr.get(mjDataMgr.KEYS.CFG).paiScale || 1;
        this.pengGangHeng = 60 * this.paiScale;
        this.pengGangZhi = 80 * this.paiScale;
        this.shouWidth = 84 * this.paiScale;
        this.EndWidth = 40;
        this.EndHeight = -53;
        this.gangDiff = 20;
        this.outPaiDis = 10 * this.paiScale;
        this.paiBackHitzoneN = paiListNode.getChildByName("paiBackHitzone");
        this.paiBackHitzoneN.on("touchend", this.showPaiBack, this);
        this.is3DView = cc.sys.localStorage.getItem("mjEyeView") == "3D";
        fun.event.add("mjViewChangeXia", "mjViewChange", this.onViewChange.bind(this));
        this.refrePaiNode();
    };

    this._OnDestroy = function () {
        fun.event.remove("mjViewChangeXia");
    };

    this.onViewChange = function () {
        this.is3DView = cc.sys.localStorage.getItem("mjEyeView") == "3D";
        if (!require("mjGameManager").isPlaying) {
            return;
        }
        // this.removeNodeChild(this.dachuPaiN);
        this.refreDachuPai();
        this.refrePaiNode();
        // this.removeNodeChild(this.buhuaPaiN);
        // this.refreBuhua();
    };

    this.refrePaiNode = function () {
        this.buhuaPaiN.scaleX = this.is3DView ? 0.72 : 0.8;
        this.buhuaPaiN.scaleY = this.is3DView ? 0.72 : 0.8;
    };

    this.initRound = function () {
        this.superInitRound();
        this.OutPaiNode = undefined;
        this.shouPaiN.x = this.pengStartPos.x;
        this.pengGangPaiN.x = this.pengStartPos.x;
    };

    this.superPutPaiNode = this.putPaiNode;
    this.putPaiNode = function (paiNode) {
        this.rmTouchEvent(paiNode);
        this.superPutPaiNode(paiNode);
    };
    this.getShouPaiInfo = function (pai, shouLen, isMo, index, paiNode) {
        var PaiType = require("mjGameDefine").PAISHOWTYPE;
        var info = {};
        info.zOrder = index;
        shouLen = isMo ? shouLen + this.shouWidth / 2 : shouLen;
        info.pos = cc.p(shouLen, paiNode.y);
        info.shouLen = shouLen + this.shouWidth;
        info.curScale = this.paiScale;
        if (pai.showType == PaiType.PENG) {
            info.curScale = info.curScale * 1.4;
        }
        return info;
    };

    this.getPengGangInfo = function (pai, pengGangLen, index) {
        var info = {};
        info.zOrder = index;
        // if(!this.is3DView){

        if (index == 3) {
            info.zOrder = 100;
            info.pos = cc.p(pengGangLen - this.paiZoneList[pai.showType] - this.pengGangHeng, 18);
            info.len = pengGangLen;
        } else {
            info.pos = cc.p(pengGangLen, 0);
            info.len = pengGangLen + this.paiZoneList[pai.showType];
        }
        // }else{

        // }
        return info;
    };

    this.setShouRelativePos = function (pengGangLen, shouLen) {
        var totalLen = this.paiListNode.width * this.paiScale;
        this.pengGangPaiN.x = (totalLen - shouLen * this.paiScale - pengGangLen * this.paiScale) / 2;
        this.shouPaiN.x = this.pengGangPaiN.x + pengGangLen;
    };

    //----------------打 的 牌-----------------

    // this.setDachuPaiPos = function(paiNode, index){

    // }

    this.getDachuInfo = function (index) {
        var horizontal = 11;
        var honIndex = index % horizontal;
        var verIndex = Math.floor(index / horizontal);
        var info = {};
        var startScale = 0.73;
        var zoomScale = 1.03;
        info.is3DView = this.is3DView;
        var mj3Ddis = [0, 56, 112, 166.5, 223, 277.5, 332, 384.5, 438.5, 490.5, 544.5, 598];
        if (!this.is3DView) {
            info.pos = cc.p(honIndex * this.EndWidth, verIndex * this.EndHeight);
            info.bgFrameName = "pz_tang";
            info.zOrder = index;
            info.curScale = 1;
            info.sfScale = 0.84;
            info.contentPos = cc.p(25, 9);
        } else {
            //27.5  25 29.5
            info.bgFrameName = "x_d_" + honIndex;
            var curScale = startScale * Math.pow(zoomScale, verIndex);
            var len = -7 * verIndex + mj3Ddis[honIndex] * curScale - 15;
            info.pos = cc.p(len, Math.pow(1.016, verIndex) * -43 * verIndex);
            info.curScale = curScale * 1.2;
            info.zOrder = verIndex * 20 + honIndex * (honIndex > 5 ? -1 : 1);
            info.sfScale = 0.84;
            if (honIndex > 5) {
                info.skewX = 5 - honIndex;
                info.contentPos = cc.p(20.5 + honIndex * 0.9, 12);
            } else {
                info.skewX = 7.5 - honIndex * 1.5;
                info.contentPos = cc.p(27.5 - honIndex * 0.5, 12);
            }
        }
        return info;
    };

    //---------------------------------

    this.getBuhuaInfo = function (paiNode, index) {
        var info = {};
        info.zOrder = index;
        // info.is3DView = this.is3DView;
        var startScale = 0.73;
        var zoomScale = 1.03;
        var mj3Ddis = [0, 56, 112, 166.5, 223, 277.5, 332, 384.5, 438.5, 490.5, 544.5, 598];
        if (true) {
            info.pos = cc.p(index * 40, 0);
            info.bgFrameName = "pz_tang";
            info.sfScale = 0.84;
            info.curScale = 1;
            info.contentPos = cc.p(25, 9);
        } else {
            var horizontal = 22;
            var honIndex = index % horizontal;
            honIndex = honIndex > 10 ? 10 : honIndex;
            var verIndex = 3;
            info.bgFrameName = "x_d_5";
            var curScale = startScale * Math.pow(zoomScale, verIndex);
            var len = -7 * verIndex + mj3Ddis[honIndex] * curScale + 200;
            info.pos = cc.p(len, Math.pow(1.016, verIndex) * -43 * verIndex + 140);
            info.curScale = curScale * 1.2;
            info.zOrder = verIndex * 20 + honIndex * (honIndex > 5 ? -1 : 1);
            // info.skewX   = (7.5 - honIndex * 1.5)*curScale;
            info.sfScale = 0.96;
        }
        return info;
    };

    this.addTouchEvent = function (paiNode) {
        paiNode.on("touchend", this.onPaiNodeClicked, paiNode);
        paiNode.on("touchcancel", this.onPaiNodeClicked, paiNode);
        paiNode.on("touchmove", this.onPaiNodeMove, paiNode);
        paiNode.on("touchstart", this.onPaiNodeStart, paiNode);
    };

    this.rmTouchEvent = function (paiNode) {
        paiNode.off("touchend", this.onPaiNodeClicked, paiNode);
        paiNode.off("touchcancel", this.onPaiNodeClicked, paiNode);
        paiNode.off("touchmove", this.onPaiNodeMove, paiNode);
        paiNode.off("touchstart", this.onPaiNodeStart, paiNode);
    };

    this.onPaiNodeMove = function (event) {
        var self = this.instance;
        var paiNode = this;
        if (!self.playerUI.player.isTrunToMe()) {
            return;
        }
        self.paiMovePos.x += event.getDelta().x;
        self.paiMovePos.y += event.getDelta().y;
        if (!self.dragPai) {
            var moveDistance = Math.abs(cc.pDistance(self.dragDefaultPos, self.paiMovePos));
            if (moveDistance > 10) {
                var pai = paiNode.pai;
                pai.setShowType(require("mjGameDefine").PAISHOWTYPE.SHOU);
                self.dragPai = self.getPaiNode(pai);
                self.dragPai.getComponent("mjPaiUI").refresh(pai);
                self.playerUI.player.showChoosePai(paiNode.pai);
                self.shouPaiN.addChild(self.dragPai);
                self.dragPai.setLocalZOrder(999);
                self.updateDragPos();
            }
        } else {
            self.updateDragPos();
        }
    };

    this.onPaiNodeStart = function () {
        log("-this.onPaiNodeStart---");
        var self = this.instance;
        var paiNode = this;
        self.paiMovePos = paiNode.getPosition();
        self.dragDefaultPos = paiNode.getPosition();
    };

    this.updateDragPos = function () {
        log("-this.onPaiNodeStart---");
        this.dragPai.setPosition(this.paiMovePos);
    };

    this.onPaiNodeClicked = function () {
        var self = this.instance;
        var paiNode = this;
        if (self.dragPai) {
            self.onDragEnd(paiNode);
        } else {
            if (!self.OutPaiNode) {
                self.showPaiOut(paiNode);
            } else if (paiNode.name == self.OutPaiNode.name) {
                self.lastTime = self.lastTime || 0;
                var nowTime = new Date().getTime();
                if (nowTime - self.lastTime > 1000) {
                    self.playerUI.player.turnToDaPai(paiNode.pai);
                    self.lastTime = nowTime;
                }
                self.showPaiBack();
            } else {
                self.showPaiBack();
                self.showPaiOut(paiNode);
            }
        }
    };

    this.showPaiOut = function (paiNode) {
        this.OutPaiNode = paiNode;
        paiNode.y += this.outPaiDis;
        this.playerUI.player.showChoosePai(paiNode.pai);
        this.paiBackHitzoneN.active = true;
    };

    this.showPaiBack = function () {
        this.paiBackHitzoneN.active = false;
        if (this.OutPaiNode) {
            this.OutPaiNode.y -= this.outPaiDis;
        }
        delete this.OutPaiNode;
        this.playerUI.player.showChoosePai(-999);
    };

    //paiFunc------------
    this.onDragEnd = function (paiNode) {
        var moveDistance = this.paiMovePos.y - this.dragDefaultPos.y;
        this.putPaiNode(this.dragPai);
        this.dragPai = undefined;
        this.playerUI.player.showChoosePai(-999);
        if (moveDistance > 100) {
            this.playerUI.player.turnToDaPai(paiNode.pai);
        }
    };

    //获取新牌移动的动画
    this.getNewMoveAction = function (newPos, curPos) {
        //距离
        var moveX = newPos.x - curPos.x;
        var action1 = cc.moveBy(0.1, cc.p(0, 70));
        var action2 = cc.moveBy(this.getDisTime(newPos, curPos), cc.p(moveX, 0));
        var action3 = cc.moveBy(0.1, cc.p(0, -70));
        return cc.sequence(action1, action2, action3);
    };
};

module.exports = {
    instance: xiaControl
};

cc._RF.pop();