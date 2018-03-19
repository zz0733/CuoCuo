(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/game/paiju/mjPaijuYou.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '26be4Uvv8xHCqHPaCnznT0C', 'mjPaijuYou', __filename);
// mahjong/script/game/paiju/mjPaijuYou.js

"use strict";

var mjDataMgr = require("mjDataMgr");
/////////////////////////////// 右方玩家 //////////////////////////////////////////////////////////

var youControl = function youControl() {
    this.init = function () {
        this.paiScale = mjDataMgr.get(mjDataMgr.KEYS.CFG).paiScale || 1;
        this.pengGangHeng = 28 * this.paiScale;
        this.pengGangZhi = 41 * this.paiScale;
        this.gangDiff = 20;
        this.shouWidth = 26 * this.paiScale;
        this.EndWidth = 49;
        this.EndHeight = 28;
        this.is3DView = cc.sys.localStorage.getItem("mjEyeView") == "3D";
        fun.event.add("mjViewChangeYou", "mjViewChange", this.onViewChange.bind(this));
    };

    this.initRound = function () {
        this.superInitRound();
        this.shouPaiN.y = this.pengStartPos.y;
        this.pengGangPaiN.y = this.pengStartPos.y;
    };

    this._OnDestroy = function () {
        fun.event.remove("mjViewChangeYou");
    };

    this.onViewChange = function () {
        this.is3DView = cc.sys.localStorage.getItem("mjEyeView") == "3D";
        if (!require("mjGameManager").isPlaying) {
            return;
        }
        // this.removeNodeChild(this.dachuPaiN);
        this.refreDachuPai();
        // this.removeNodeChild(this.shouPaiN);
        this.checkPaiNode(this.shouPaiN, this.getPaiData().shouShangPai);
        this.refreShouPai();
        // this.removeNodeChild(this.buhuaPaiN);
        this.refreBuhua();
        // this.removeNodeChild(this.pengGangPaiN);
        this.refrePengGangPos();
    };

    this.setShouPaiPos = function (paiNode, pai, shouLen, isMo, index) {
        // if(!this.is3DView){
        // 
        // }else 
        var width = this.paiZoneList[pai.showType];
        shouLen = isMo ? shouLen + width / 2 : shouLen;
        paiNode.setPosition(cc.p(0, shouLen));
        paiNode.setLocalZOrder(100 - index);
        return shouLen + width;
    };

    this.getShouPaiInfo = function (pai, shouLen, isMo, index) {
        var info = {};
        info.zOrder = 100 - index;
        info.is3DView = this.is3DView;
        info.bgFrameName = this.getBgFrame(pai);
        if (!this.is3DView) {
            shouLen = isMo ? shouLen + this.shouWidth / 2 : shouLen;
            info.pos = cc.p(0, shouLen);
            info.shouLen = shouLen + this.shouWidth;
            // info.bgFrameName = "zy_shou";
        } else {
            var gangList = this.getPaiData().pengGangPai.gang;
            var pengList = this.getPaiData().pengGangPai.peng;
            var pIndex = (gangList.length + pengList.length) * 3 + index;
            shouLen = isMo ? shouLen + this.shouWidth / 2 : shouLen;
            info = this.getPai3dInfo(pai, pIndex, shouLen, info);
            var width = 26 * info.posScale * 0.9;
            info.shouLen = shouLen + width;
        }
        return info;
    };

    this.getBgFrame = function (pai) {
        var PaiType = require("mjGameDefine").PAISHOWTYPE;
        var bgFrameName = "";
        if (pai.showType == PaiType.PENG) {
            bgFrameName = !this.is3DView ? "zy_heng" : "y_p_0";
        } else if (pai.showType == PaiType.PENGBY) {
            bgFrameName = !this.is3DView ? "zy_tang" : "y_pb_0";
        } else if (pai.showType == PaiType.SHOUGAI) {
            bgFrameName = !this.is3DView ? "zy_gai" : "y_gai";
        } else if (pai.showType == PaiType.SHOU) {
            bgFrameName = !this.is3DView ? "zy_shou" : "y_s_0";
        } else if (pai.showType == PaiType.END) {
            bgFrameName = !this.is3DView ? "zy_heng" : "y_d_";
        } else if (pai.showType == PaiType.GAI) {
            bgFrameName = !this.is3DView ? "zy_gai" : "y_gai";
        }
        return bgFrameName;
    };

    this.getPai3dInfo = function (pai, index, shouLen, info) {
        var PaiType = require("mjGameDefine").PAISHOWTYPE;
        var startScale = 0.64;
        var zoomScale = 0.988;
        info.posScale = Math.pow(0.99, index) * 0.94;
        info.is3DView = this.is3DView;
        info.pos = cc.p(index * -7 * info.posScale - 20, shouLen);
        info.curScale = startScale * Math.pow(zoomScale, index);
        if (pai.showType == PaiType.SHOUGAI) {
            // info.bgFrameName = "y_gai"
            info.curScale = info.curScale * 1.2;
        } else if (pai.showType == PaiType.PENG) {
            // info.bgFrameName = "y_p_0";
            info.curScale = info.curScale * 1.288;
            info.posScale = Math.pow(0.992, index) * 0.98;
            info.skewY = 15;
            info.contentPos = cc.p(-30, 32);
        } else if (pai.showType == PaiType.PENGBY) {
            // info.bgFrameName = "y_pb_0";
            info.curScale = info.curScale * 1.288;
            info.skewX = -16;
            info.contentPos = cc.p(-22, 34);
            info.posScale = Math.pow(0.992, index) * 0.828;
            if (index % 3 == 0) {
                info.pos.x += 2 * info.posScale;
            }
        } else if (pai.showType == PaiType.GAI) {
            // info.bgFrameName = "y_gai";
            info.curScale = startScale * Math.pow(zoomScale, index) * 1.196;
            info.posScale = info.posScale * 0.828;
            info.pos = cc.p(index * -7 * info.posScale - 20, shouLen);
        } else {
            // info.bgFrameName = "y_s_0"
        }

        return info;
    };

    this.getDachuInfo = function (index) {
        var horizontal = 11;
        var honIndex = index % horizontal;
        var verIndex = Math.floor(index / horizontal);
        var info = {};
        var startScale = 0.64;
        var zoomScale = 0.984;
        info.zOrder = Math.floor(100 - verIndex * 20 - honIndex);
        info.is3DView = this.is3DView;
        if (!this.is3DView) {
            info.pos = cc.p(verIndex * this.EndWidth, honIndex * this.EndHeight);
            info.bgFrameName = "zy_heng";
            info.curScale = 0.86;
            info.contentPos = cc.p(-28, 35);
            // info.zOrder = (Math.floor(index / 11) * 20  - index%11 );
        } else {
            info.bgFrameName = "y_d_" + verIndex;
            var curScale = startScale * Math.pow(zoomScale, honIndex);
            info.pos = cc.p(verIndex * (64 * startScale) - 7.2 * startScale * honIndex - verIndex * Math.pow(1.24, honIndex) - 18, honIndex * 46 * startScale * Math.pow(0.992, honIndex) - 5);
            info.curScale = curScale;
            info.skewY = 10; //(honIndex * 1.5 - 7.5) * curScale;
            info.sfScale = 1.2;
            info.contentPos = cc.p(-32, 40);
        }
        return info;
    };

    this.getBuhuaInfo = function (paiNode, index) {
        var info = {};
        info.zOrder = 100 - index;
        info.is3DView = this.is3DView;
        if (!this.is3DView) {
            info.pos = cc.p(0, index * 28);
            info.bgFrameName = "zy_heng";
            info.contentPos = cc.p(-28, 35);
        } else {
            var startScale = 0.64;
            var zoomScale = 0.984;
            info.bgFrameName = "y_d_" + 2;
            var curScale = startScale * Math.pow(zoomScale, index);
            // let lastScal = startScale * Math.pow(zoomScale, (index -1 ));
            info.pos = cc.p(index * -12 * curScale - 40, index * 46 * curScale * Math.pow(1.008, index));
            info.curScale = curScale;
            info.contentPos = cc.p(-32, 40);
            info.skewY = 10;
            info.sfScale = 1.2;
        }
        return info;
    };

    this.getPengGangInfo = function (pai, pengGangLen, index, pIndex) {
        var PaiType = require("mjGameDefine").PAISHOWTYPE;
        var info = {};
        info.zOrder = 100 - pIndex;
        var width = this.paiZoneList[pai.showType];
        info.is3DView = this.is3DView;
        info.len = pengGangLen;
        info.bgFrameName = this.getBgFrame(pai);
        if (!this.is3DView) {
            if (index == 3) {
                info.zOrder = 100;
                info.pos = cc.p(0, pengGangLen - this.pengGangZhi - 4);
            } else {
                info.pos = cc.p(0, pengGangLen);
            }
            if (pai.showType == PaiType.PENG) {
                // info.bgFrameName = "zy_heng";
                info.curScale = this.paiScale * 0.98;
                info.contentPos = cc.p(-30, 34);
            } else if (pai.showType == PaiType.PENGBY) {
                // info.bgFrameName = "zy_tang";
                info.curScale = this.paiScale * 0.92;
                info.contentPos = cc.p(-22, 39);
            } else if (pai.showType == PaiType.GAI) {
                // info.bgFrameName = "zy_gai";
                info.curScale = this.paiScale * 0.94;
            }
        } else {
            info = this.getPai3dInfo(pai, pIndex, pengGangLen, info);
            width = width * info.posScale;
            if (index == 3) {
                info.zOrder = 100;
                info.pos.y -= this.pengGangHeng * 1.6 * info.posScale;
                info.pos.x += 22 * info.posScale;
            }
        }
        info.len = index != 3 ? info.len + width : info.len;
        return info;
    };

    this.setShouRelativePos = function (pengGangLen, shouLen) {
        // if(this.is3DView){return}
        var totalLen = this.paiListNode.height;
        this.pengGangPaiN.y = (totalLen - shouLen - pengGangLen) / 2;
        this.shouPaiN.y = this.pengGangPaiN.y + pengGangLen;
    };
};

module.exports = {
    instance: youControl
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
        //# sourceMappingURL=mjPaijuYou.js.map
        