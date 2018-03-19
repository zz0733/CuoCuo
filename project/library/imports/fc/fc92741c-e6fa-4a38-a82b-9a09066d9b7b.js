"use strict";
cc._RF.push(module, 'fc927Qc5vpKOKgrmgkGbZt7', 'mjPai');
// mahjong/script/game/common/mjPai.js

"use strict";

var udidTag = 0;

var Pai = function Pai(id) {
    this.id = id || 0;
    this.rotate = 0;
    this.sortId = id;
    this.udid = "pai_" + udidTag++;
    this.isCaiShen = false;
    this.isBaiDa = false;
    this.isGai = false;
    this.showIndex = 0;
    this.showType = require("mjGameDefine").PAISHOWTYPE.SHOU;
    //是否为字牌
    // this.isTesuPai = (GameDefine.TeSuPaiID(id) != undefined);

    this.refreshCaiShen = function () {
        var gameManager = require("mjGameManager");
        var caiShenInfo = gameManager.isCaiShenPai(this.id);
        this.isCaiShen = caiShenInfo.isCaiShen;
        this.isBaiDa = caiShenInfo.isBaiDa;
        this.isMagic = caiShenInfo.isMagic;
    };
    this.setRotate = function (rotate) {
        this.rotate = rotate;
    };
    this.refreshSort = function () {
        var gameManager = require("mjGameManager");
        this.sortId = gameManager.getSortId(id);
    };
    this.setIsGai = function (gai) {
        this.isGai = gai;
    };
    this.setShowType = function (showType) {
        this.showType = showType;
    };
    this.getLocalId = function () {
        return require("mjDataMgr").getInstance().getLocalPaiID(this.id);
    };
    this.refreshCaiShen();
};

module.exports = {
    new: function _new(id) {
        return new Pai(id);
    }
};

cc._RF.pop();