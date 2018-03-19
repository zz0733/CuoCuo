(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/game/paiju/mjPaijuShang.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b41d7Jo5nRD2Youv8fUlAS+', 'mjPaijuShang', __filename);
// mahjong/script/game/paiju/mjPaijuShang.js

"use strict";

var mjDataMgr = require("mjDataMgr");
/////////////////////////////// 上方玩家 //////////////////////////////////////////////////////////

var shangControl = function shangControl() {

    this.init = function () {
        this.paiScale = mjDataMgr.get(mjDataMgr.KEYS.CFG).paiScale || 1;
        this.pengGangHeng = 41 * this.paiScale;
        this.pengGangZhi = 58 * this.paiScale;
        this.gangDiff = 10;
        this.EndWidth = 40;
        this.EndHeight = 50;
        this.shouWidth = 33 * this.paiScale;
        this.paiListNode.defX = this.paiListNode.defX || this.paiListNode.x;
        this.dachuPaiN.defX = this.dachuPaiN.defX || this.dachuPaiN.x;
        this.is3DView = cc.sys.localStorage.getItem("mjEyeView") == "3D";
        fun.event.add("mjViewChangeShang", "mjViewChange", this.onViewChange.bind(this));
        this.refrePaiNode();
    };

    this.initRound = function () {
        this.superInitRound();
        this.shouPaiN.x = this.pengStartPos.x;
        this.pengGangPaiN.x = this.pengStartPos.x;
    };

    this._OnDestroy = function () {
        fun.event.remove("mjViewChangeShang");
    };

    this.onViewChange = function () {
        this.is3DView = cc.sys.localStorage.getItem("mjEyeView") == "3D";
        if (!require("mjGameManager").isPlaying) {
            return;
        }
        // this.removeNodeChild(this.dachuPaiN);
        this.refreDachuPai();
        // this.removeNodeChild(this.buhuaPaiN);
        // this.refreBuhua();
        this.refrePaiNode();
    };

    this.refrePaiNode = function () {
        this.shouPaiN.scaleX = this.is3DView ? 0.9 : 1;
        this.shouPaiN.scaleY = this.is3DView ? 0.8 : 1;
        this.pengGangPaiN.scaleX = this.is3DView ? 0.9 : 1;
        this.pengGangPaiN.scaleY = this.is3DView ? 0.8 : 1;
        this.buhuaPaiN.scaleX = this.is3DView ? 0.63 : 0.7;
        this.buhuaPaiN.scaleY = this.is3DView ? 0.63 : 0.7;
        this.paiListNode.x = this.is3DView ? this.paiListNode.defX - 40 : this.paiListNode.defX;
        this.dachuPaiN.x = this.is3DView ? this.dachuPaiN.defX + 40 : this.dachuPaiN.defX;
    };

    this.getPengGangInfo = function (pai, pengGangLen, index) {
        var info = {};
        info.zOrder = index;
        // if(!this.is3DView){

        if (index == 3) {
            info.zOrder = 100;
            info.pos = cc.p(0 - pengGangLen + this.paiZoneList[pai.showType] + this.pengGangHeng, 10);
            info.len = pengGangLen;
        } else {
            info.pos = cc.p(0 - pengGangLen, 0);
            info.len = pengGangLen + this.paiZoneList[pai.showType];
        }
        // }else{

        // }
        return info;
    };

    this.setShouRelativePos = function (pengGangLen) {
        this.shouPaiN.x = this.pengGangPaiN.x - pengGangLen - 10;
    };

    this.setShouPaiPos = function (paiNode, pai, shouLen, isMo) {
        var width = this.paiZoneList[pai.showType];
        shouLen = isMo ? shouLen + width / 2 : shouLen;
        paiNode.setPosition(cc.p(0 - shouLen, 0));
        return shouLen + width;
    };

    this.getShouPaiInfo = function (pai, shouLen, isMo, index) {
        var info = {};
        info.zOrder = index;
        shouLen = isMo ? shouLen + this.shouWidth / 2 : shouLen;
        info.pos = cc.p(0 - shouLen, 0);
        info.shouLen = shouLen + this.shouWidth;
        var PaiType = require("mjGameDefine").PAISHOWTYPE;
        // if(!this.is3DView){
        shouLen = isMo ? shouLen + this.shouWidth / 2 : shouLen;
        info.pos = cc.p(0 - shouLen, 0);
        if (pai.showType == PaiType.PENG) {
            // info.curScale = this.paiScale * 0.8;
            info.shouLen = shouLen + this.shouWidth * 1.26;
        } else {
            info.shouLen = shouLen + this.shouWidth;
        }

        // }else {

        // }
        return info;
    };

    this.getDachuInfo = function (index) {
        var horizontal = 11;
        var honIndex = index % horizontal;
        var verIndex = Math.floor(index / horizontal);
        var info = {};
        var startScale = 0.7;
        var zoomScale = 0.972;
        info.is3DView = this.is3DView;
        var mj3DLen = [0, 46, 92, 137, 184, 229, 275.5, 320, 365.5, 409.5, 454];
        if (!this.is3DView) {
            info.pos = cc.p(0 - honIndex * this.EndWidth, verIndex * this.EndHeight);
            info.bgFrameName = "pz_tang";
            info.zOrder = 100 - index;
            info.curScale = 0.84;
            info.sfScale = 1.1;
            info.contentPos = cc.p(-25, 10);
        } else {
            // -22.7,10 
            info.bgFrameName = "s_d_" + (10 - honIndex);
            var curScale = startScale * Math.pow(zoomScale, verIndex);
            var len = -60 + -4.8 * verIndex + mj3DLen[honIndex] * curScale * -1;
            info.pos = cc.p(len, Math.pow(0.978, verIndex) * 53 * startScale * verIndex - 10);
            info.curScale = curScale;
            info.zOrder = verIndex * -20 + honIndex * (honIndex > 5 ? -1 : 1);
            info.skewX = (honIndex - 5) * 1.5 * curScale;
            info.sfScale = 0.9;
            info.contentPos = cc.p(-22.7 - honIndex / 8, 10);
        }
        return info;
    };

    this.getBuhuaInfo = function (paiNode, index) {
        var info = {};
        info.zOrder = index;
        // info.is3DView = this.is3DView;
        var startScale = 0.7;
        var zoomScale = 0.972;
        var mj3DLen = [0, 46, 92, 137, 184, 229, 275.5, 320, 365.5, 409.5, 454];
        // if(true){
        info.pos = cc.p(index * -40, 0);
        info.bgFrameName = "pz_tang";
        info.curScale = 0.84;
        // }else {
        //     var horizontal   = 22;
        //     var honIndex     = index % horizontal ;
        //     honIndex =  honIndex > 10 ? 10 : honIndex;
        //     var verIndex     = Math.floor(index / horizontal) + 3
        //     // info.bgFrameName = "s_d_" + (10 -honIndex);
        //     info.bgFrameName = "s_d_5"
        //     let curScale     = startScale * Math.pow(zoomScale, verIndex);
        //     // info.skewX       = (honIndex  - 5) * 2 * curScale;
        //     info.sfScale     = 0.82;
        //     let len =  -4.8 * verIndex +mj3DLen[honIndex] * curScale * -1.3 - 124;
        //     info.pos = cc.p(len, Math.pow(0.978, verIndex) * 53 * startScale * verIndex - 100);
        // }
        return info;
    };
};

module.exports = {
    instance: shangControl
};

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
        //# sourceMappingURL=mjPaijuShang.js.map
        