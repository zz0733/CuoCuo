(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/ui/prefab/mjChiDetailUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9aa48oKZrBO+pOA5clKRuAF', 'mjChiDetailUI', __filename);
// mahjong/script/ui/prefab/mjChiDetailUI.js

"use strict";

var gameManager = require("mjGameManager");
cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        // this.canCilcked = false;
    },

    onSelfCilcked: function onSelfCilcked() {
        // if(!this.canCilcked){return}
        this.gameUI.hideMoreChiUI();
        gameManager.chiPaiToServer(this.eatData, this.comb);
    },

    init: function init(gameUI, comb, eatData) {
        var self = this;

        var chiID = eatData.Atile;
        // setTimeout(function(){
        //     self.canCilcked = true;
        // }, 1000)
        this.gameUI = gameUI;
        this.eatData = eatData;
        this.comb = comb;
        var showEatList = comb.slice(); //复制数组
        if (showEatList.length == 2) {
            showEatList.push(eatData.Atile);
        }
        showEatList = gameManager.sortGroupPai(showEatList);
        for (var i = 0; i < 3; i++) {
            var id = showEatList[i];
            var paiNode = this.node.getChildByName("pai_" + i);
            var spriteNode = paiNode.getChildByName("content");
            var paiSprite = this.gameUI.getPaiSprite(id);
            spriteNode.getComponent(cc.Sprite).spriteFrame = paiSprite;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
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
        //# sourceMappingURL=mjChiDetailUI.js.map
        