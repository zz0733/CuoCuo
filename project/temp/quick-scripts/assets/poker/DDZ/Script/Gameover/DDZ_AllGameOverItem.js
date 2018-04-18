(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Gameover/DDZ_AllGameOverItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '06e48uhCbRH37gOYjW476sh', 'DDZ_AllGameOverItem', __filename);
// poker/DDZ/Script/Gameover/DDZ_AllGameOverItem.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        atlas: cc.SpriteAtlas

    },

    start: function start() {},

    initItemNode: function initItemNode(data) {
        this.bindNode();
        this.initUI(data);
    },
    bindNode: function bindNode() {
        this.headNode = this.node.getChildByName("HeadNode");
        this.totalInfoNode = this.node.getChildByName("TotalInfo");
        this.totalCoinNode = this.node.getChildByName("TotalCoin");
        this.fangKaNode = this.node.getChildByName("FangKa");
        this.IDNode = this.headNode.getChildByName("IDBG").getChildByName("ID");
        this.headSprNode = this.headNode.getChildByName("HeadSpr");
        this.nickNameNode = this.headNode.getChildByName("nickName");
        this.winIconNode = this.headNode.getChildByName("WinIcon");
        this.zadan = this.totalInfoNode.getChildByName("title1").getChildByName("Num");
        this.feiji = this.totalInfoNode.getChildByName("title2").getChildByName("Num");
        this.liandui = this.totalInfoNode.getChildByName("title3").getChildByName("Num");
        this.spring = this.totalInfoNode.getChildByName("title4").getChildByName("Num");
        this.totalCoin = this.totalCoinNode.getChildByName("Title").getChildByName("Num");
        this.totalCoin_l = this.totalCoinNode.getChildByName("Title").getChildByName("Num_l");
        this.useFangKa = this.fangKaNode.getChildByName("cardSpr").getChildByName("Num");
        this.leaveFangKa = this.fangKaNode.getChildByName("cardSpr_1").getChildByName("Num");
    },
    initUI: function initUI(data) {
        fun.utils.loadUrlRes(data.headUrl, this.headSprNode); // 头像
        if (data.isChampion == true) {
            this.winIconNode.active = true;
            this.node.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame("dz_dajiesuan_di2");
            this.winIconNode.stopAllActions();
            this.winIconNode.runAction(cc.sequence(cc.scaleTo(0.4, 2.3), cc.scaleTo(0.4, 1.8).easing(cc.easeBackOut())));
        } else {
            this.winIconNode.active = false;
            this.node.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame("dz_dajiesuan_di1");
        }
        this.IDNode.getComponent(cc.Label).string = data.userId;
        this.nickNameNode.getComponent(cc.Label).string = data.nickName;
        this.zadan.getComponent(cc.Label).string = data.boomCount;
        this.feiji.getComponent(cc.Label).string = data.airCount;
        this.liandui.getComponent(cc.Label).string = data.lianDuiCount;
        this.spring.getComponent(cc.Label).string = data.springCount;
        this.useFangKa.getComponent(cc.Label).string = data.expendCardsCount;
        this.leaveFangKa.getComponent(cc.Label).string = data.remainCardsCount;
        if (data.score >= 0) {
            this.totalCoin.getComponent(cc.Label).string = data.score;
            this.totalCoin_l.active = false;
        } else {
            this.totalCoin_l.getComponent(cc.Label).string = data.score;
            this.totalCoin.active = false;
        }
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
        //# sourceMappingURL=DDZ_AllGameOverItem.js.map
        