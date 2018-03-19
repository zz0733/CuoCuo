(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/game/paiju/mjPaijuZuo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7d5c49LokBBmbt9jW/T1VMh', 'mjPaijuZuo', __filename);
// mahjong/script/game/paiju/mjPaijuZuo.js

"use strict";

var mjDataMgr = require("mjDataMgr");

/////////////////////////////// 左方玩家 //////////////////////////////////////////////////////////

var zuoControl = function zuoControl() {
    this.init = function () {
        this.paiScale = mjDataMgr.get(mjDataMgr.KEYS.CFG).paiScale || 1;
        this.pengGangHeng = 28 * this.paiScale;
        this.pengGangZhi = 41 * this.paiScale;
        this.gangDiff = 20;
        this.shouWidth = 26 * this.paiScale;
        this.EndWidth = -48.5;
        this.EndHeight = -28;
        this.is3DView = cc.sys.localStorage.getItem("mjEyeView") == "3D";
        fun.event.add("mjViewChangZuo", "mjViewChange", this.onViewChange.bind(this));
    };
    this._OnDestroy = function () {
        fun.event.remove("mjViewChangZuo");
    };

    this.initRound = function () {
        this.superInitRound();
        this.shouPaiN.y = this.pengStartPos.y;
        this.pengGangPaiN.y = this.pengStartPos.y;
    };

    this.onViewChange = function () {
        this.is3DView = cc.sys.localStorage.getItem("mjEyeView") == "3D";
        if (!require("mjGameManager").isPlaying) {
            return;
        }
        // this.removeNodeChild(this.dachuPaiN);
        // this.removeNodeChild(this.shouPaiN);
        // this.removeNodeChild(this.buhuaPaiN);
        this.refreDachuPai();
        this.checkPaiNode(this.shouPaiN, this.getPaiData().shouShangPai);
        this.refreShouPai();
        this.refreBuhua();
        // this.removeNodeChild(this.pengGangPaiN);
        this.refrePengGangPos();
        // this.refre        
    };

    // this.setShouPaiPos =  function(paiNode, pai, shouLen, isMo, index){
    //     var width = this.paiZoneList[pai.showType];
    //     shouLen   = isMo  ?  shouLen + width / 2 : shouLen
    //     paiNode.setPosition(cc.p(0, 0-shouLen));
    //     paiNode.setLocalZOrder(index);
    //     return( shouLen + width );
    // }

    this.getBgFrame = function (pai) {
        var PaiType = require("mjGameDefine").PAISHOWTYPE;
        var bgFrameName = "";
        if (pai.showType == PaiType.PENG) {
            bgFrameName = !this.is3DView ? "zy_heng" : "z_p_0";
        } else if (pai.showType == PaiType.PENGBY) {
            bgFrameName = !this.is3DView ? "zy_tang" : "z_pb_0";
        } else if (pai.showType == PaiType.SHOUGAI) {
            bgFrameName = !this.is3DView ? "zy_gai" : "z_gai";
        } else if (pai.showType == PaiType.SHOU) {
            bgFrameName = !this.is3DView ? "zy_shou" : "z_s_0";
        } else if (pai.showType == PaiType.END) {
            bgFrameName = !this.is3DView ? "zy_heng" : "z_d_";
        } else if (pai.showType == PaiType.GAI) {
            bgFrameName = !this.is3DView ? "zy_gai" : "z_gai";
        }
        return bgFrameName;
    };

    this.getPengGangInfo = function (pai, pengGangLen, index, pIndex) {
        var PaiType = require("mjGameDefine").PAISHOWTYPE;
        var info = {};
        info.zOrder = index;
        var width = this.paiZoneList[pai.showType];
        info.is3DView = this.is3DView;
        info.len = pengGangLen;
        info.bgFrameName = this.getBgFrame(pai);
        if (!this.is3DView) {
            if (index == 3) {
                info.pos = cc.p(5, 0 - pengGangLen + width + this.pengGangHeng);
            } else {
                info.pos = cc.p(0, 0 - pengGangLen);
            }

            if (pai.showType == PaiType.PENG) {
                // info.bgFrameName = "zy_heng";
                info.contentPos = cc.p(-1, -16);
                info.curScale = this.paiScale * 0.98;
            } else if (pai.showType == PaiType.GAI) {
                // info.bgFrameName = "zy_gai";
                info.curScale = this.paiScale * 0.92;
            } else {
                // info.bgFrameName = "zy_tang";
            }
            if (pai.showType == PaiType.PENGBY) {
                info.contentPos = cc.p(0, -20);
            }
        } else {
            info = this.getPai3dInfo(pai, pIndex, pengGangLen, info);
            width = width * info.posScale;
            if (index == 3) {
                info.pos.y += this.pengGangHeng * 2.2 * info.posScale;
                info.pos.x += 8 * info.posScale;
            }
        }
        info.len = index != 3 ? info.len + width : info.len;

        return info;
    };

    this.getShouPaiInfo = function (pai, shouLen, isMo, index) {
        var info = {};
        info.zOrder = index;
        info.is3DView = this.is3DView;
        info.bgFrameName = this.getBgFrame(pai);
        if (!this.is3DView) {
            shouLen = isMo ? shouLen + this.shouWidth / 2 : shouLen;
            info.pos = cc.p(0, 0 - shouLen);
            info.shouLen = shouLen + this.shouWidth;
        } else {
            var gangList = this.getPaiData().pengGangPai.gang;
            var pengList = this.getPaiData().pengGangPai.peng;
            var pIndex = (gangList.length + pengList.length) * 3 + index;
            shouLen = isMo ? shouLen + this.shouWidth / 2 : shouLen;
            info = this.getPai3dInfo(pai, pIndex, shouLen, info);
            var width = 23.5 * info.posScale;
            info.shouLen = shouLen + width;
        }
        return info;
    };

    this.getPai3dInfo = function (pai, index, shouLen, info) {
        var PaiType = require("mjGameDefine").PAISHOWTYPE;
        var startScale = 0.5;
        var zoomScale = 1.022;
        info.posScale = Math.pow(1.018, index) * 0.76;
        info.pos = cc.p(index * -5 * info.posScale + 70, 0 - shouLen);
        info.curScale = startScale * Math.pow(zoomScale, index);
        if (pai.showType == PaiType.SHOUGAI) {
            // info.bgFrameName ="z_gai"
            info.curScale = info.curScale * 1.4;
        } else if (pai.showType == PaiType.PENG) {
            // info.bgFrameName = "z_p_0";
            info.curScale = info.curScale * 1.2;
            info.skewY = -15;
            info.contentPos = cc.p(-4, -13);
            info.posScale = Math.pow(1.026, index) * 0.64;
            info.pos = cc.p(index * -6.5 * info.posScale * this.paiScale + 76, 0 - shouLen);
        } else if (pai.showType == PaiType.PENGBY) {
            // info.bgFrameName = "z_pb_0";
            info.skewX = 15;
            info.contentPos = cc.p(-4, -17.5);
            info.curScale = info.curScale * 1.3;
            info.posScale = Math.pow(1.028, index) * 0.6;
            info.pos = cc.p(index * -6 * info.posScale * this.paiScale + 78 - index * this.paiScale, 0 - shouLen);
            //pengby 第一个和第二个位置不一样
            if (index % 3 == 2) {
                // info.pos.x -= 2*info.posScale;
            }
        } else if (pai.showType == PaiType.GAI) {
            // info.bgFrameName = "z_gai";
            info.curScale = info.curScale * 1.1;
            info.posScale = Math.pow(1.018, index) * 0.7;
            info.pos = cc.p(index * -6 * info.posScale + 78 - index, 0 - shouLen);
        } else {
            // info.bgFrameName = "z_s_0"

        }
        return info;
    };

    this.setDachuPaiPos = function (paiNode, index) {
        paiNode.setPosition(this.getDachuInfo(index).pos);
        paiNode.setLocalZOrder(index + 11);
    };

    this.getBuhuaInfo = function (paiNode, index) {
        var info = {};
        info.zOrder = index + 10;
        info.is3DView = this.is3DView;
        if (!this.is3DView) {
            info.pos = cc.p(0, index * -28);
            info.bgFrameName = "zy_heng";
            info.contentPos = cc.p(0, -4);
        } else {
            var startScale = 0.5446;
            var zoomScale = 1.0166;
            info.bgFrameName = "z_d_" + 2;
            var curScale = startScale * Math.pow(zoomScale, index);
            info.pos = cc.p(index * -8 * curScale + 80, index * -46 * curScale * Math.pow(0.990, index));
            info.curScale = curScale;
            info.skewY = -15; //(0 - index / 4) * curScale;
            info.contentPos = cc.p(0, -2);
            info.sfScale = 1.3;
        }

        return info;
    };

    this.getDachuInfo = function (index) {
        var horizontal = 11;
        var honIndex = index % horizontal;
        var verIndex = Math.floor(index / horizontal);
        var info = {};
        var startScale = 0.5446;
        var zoomScale = 1.0166;
        info.is3DView = this.is3DView;
        info.zOrder = Math.floor(100 - verIndex * 20 + honIndex);
        if (!this.is3DView) {
            info.pos = cc.p(verIndex * this.EndWidth, honIndex * this.EndHeight);
            info.bgFrameName = "zy_heng";
            // info.zOrder = index;
            info.curScale = 0.86;
            info.contentPos = cc.p(0, -4);
        } else {
            info.bgFrameName = "z_d_" + verIndex;
            var curScale = startScale * Math.pow(zoomScale, honIndex);
            info.pos = cc.p(verIndex * -64 * curScale - honIndex * 4 + 20, honIndex * -44 * curScale * Math.pow(0.992, honIndex) - 22);
            info.curScale = curScale;
            info.contentPos = cc.p(0, -2);
            // info.skewX   = 0 - honIndex/4; //(honIndex * 1.5 - 7.5) * curScale;
            info.skewY = -10;
            info.sfScale = 1.3;
        }
        return info;
    };

    this.setShouRelativePos = function (pengGangLen, shouLen) {
        // if(this.is3DView){return}
        var totalLen = this.paiListNode.height;
        this.pengGangPaiN.y = (shouLen + pengGangLen - totalLen) / 2;
        this.shouPaiN.y = this.pengGangPaiN.y - pengGangLen;
    };

    //获取新牌移动的动画
    this.getNewMoveAction = function (newPos, curPos) {
        //距离
        var moveY = newPos.y - curPos.y;
        var action1 = cc.moveBy(0.1, cc.p(20, 0));
        var action2 = cc.moveBy(this.getDisTime(newPos, curPos), cc.p(0, moveY));
        var action3 = cc.moveBy(0.1, cc.p(-20, 0));
        return cc.sequence(action1, action2, action3);
    };
};

module.exports = {
    instance: zuoControl
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
        //# sourceMappingURL=mjPaijuZuo.js.map
        