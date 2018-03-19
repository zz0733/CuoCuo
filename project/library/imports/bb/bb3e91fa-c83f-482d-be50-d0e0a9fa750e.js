"use strict";
cc._RF.push(module, 'bb3e9H6yD9ILb5Q0OCp+nUO', 'mjHuAnimUI');
// mahjong/script/ui/prefab/mjHuAnimUI.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        spineNode: cc.Node,
        contentNode: cc.Node,
        paiNode: cc.Node
        // paiPrefab : cc.Prefab,
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.animanager = this.spineNode.getComponent(sp.Skeleton);
        var self = this;
        var completeFunc = function completeFunc() {
            self.onAnimCompleted();
        };
        this.animanager.setCompleteListener(completeFunc);
    },

    onAnimCompleted: function onAnimCompleted() {
        this.node.removeFromParent();
        // this.playerUI.addPai(this.pai);
        setTimeout(function () {
            var gameManager = require("mjGameManager");
            gameManager.checkResultAnim();
        }, 700);
    },

    show: function show() {
        this.animanager.setAnimation(0, "Hu", false);
    }

});

cc._RF.pop();