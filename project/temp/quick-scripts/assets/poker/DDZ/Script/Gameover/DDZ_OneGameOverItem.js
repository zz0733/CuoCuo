(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Gameover/DDZ_OneGameOverItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5b5ee2rlCBN46yxryQRDqG5', 'DDZ_OneGameOverItem', __filename);
// poker/DDZ/Script/Gameover/DDZ_OneGameOverItem.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        pokerPre: cc.Prefab,
        atlas: cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},

    _sortPokerArrObj: function _sortPokerArrObj(arr) {
        return arr.sort(function (a, b) {
            return a.Num - b.Num;
        });
    },
    initItem: function initItem(data, headUrl, nickname, difen) {
        if (data.isDiZhu == true) {
            this.node.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame("dz_xiaojiesuan1");
            this.node.getChildByName("Icon").getChildByName("Word").getComponent(cc.Label).string = "地主";
        } else {
            this.node.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = null;
            this.node.getChildByName("Icon").getChildByName("Word").getComponent(cc.Label).string = "农民";
        }
        fun.utils.loadUrlRes(headUrl, this.node.getChildByName("PlayerInfoBG").getChildByName("Head")); // 头像
        this.node.getChildByName("PlayerInfoBG").getChildByName("ID").getComponent(cc.Label).string = data.userId;
        this.node.getChildByName("PlayerInfoBG").getChildByName("Name").getComponent(cc.Label).string = nickname;
        var pokers = data.handPokers;
        var temp = [];
        for (var i = 0; i < pokers.length; i++) {
            var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(pokers[i]);
            temp.push(pokerObj);
        }
        temp = this._sortPokerArrObj(temp);
        temp.reverse();
        for (var i = 0; i < temp.length; i++) {
            var pokerNode = this.initPoker(temp[i]);
            this.node.getChildByName("PokerBG").getChildByName("HandPoker").addChild(pokerNode);
            var posX = 0 + i * 50;
            pokerNode.setPosition(posX, 0);
            pokerNode.setTag(posX);
        }
        this.node.getChildByName("PokerBG").getChildByName("GameInfo").getComponent(cc.Label).string = data.extend;
        this.node.getChildByName("PokerBG").getChildByName("DiFen").getChildByName("Num").getComponent(cc.Label).string = difen;
        this.node.getChildByName("PokerBG").getChildByName("BeiShu").getChildByName("Num").getComponent(cc.Label).string = data.rate;
        if (data.score >= 0) {
            this.node.getChildByName("PokerBG").getChildByName("JiFen").getChildByName("Num").getComponent(cc.Label).string = data.score;
            this.node.getChildByName("PokerBG").getChildByName("JiFen").getChildByName("Num").color = new cc.Color(255, 237, 85);
        } else {
            this.node.getChildByName("PokerBG").getChildByName("JiFen").getChildByName("Num").getComponent(cc.Label).string = data.score;
            this.node.getChildByName("PokerBG").getChildByName("JiFen").getChildByName("Num").color = new cc.Color(157, 186, 244);
        }
    },
    initPoker: function initPoker(pokerObj) {
        var newNode = cc.instantiate(this.pokerPre);
        newNode.getComponent("DDZ_Poker").initPoker(pokerObj);
        return newNode;
    }
    // update (dt) {},
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
        //# sourceMappingURL=DDZ_OneGameOverItem.js.map
        