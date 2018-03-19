(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/ui/prefab/mjHuAnimUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bb3e9H6yD9ILb5Q0OCp+nUO', 'mjHuAnimUI', __filename);
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
        //# sourceMappingURL=mjHuAnimUI.js.map
        