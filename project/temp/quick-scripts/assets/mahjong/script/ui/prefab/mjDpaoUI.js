(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/ui/prefab/mjDpaoUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '264c4HsUKVIUa9Y9IB82pFV', 'mjDpaoUI', __filename);
// mahjong/script/ui/prefab/mjDpaoUI.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        spineNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.animManager = this.spineNode.getComponent(sp.Skeleton);
        var self = this;
        var completeCB = function completeCB() {
            self.onAnimCompleted();
            self.paijuUI.removeDachuPai(self.paiUdid);
        };
        this.animManager.setCompleteListener(completeCB);
    },

    onAnimCompleted: function onAnimCompleted() {
        var gameManager = require("mjGameManager");
        gameManager.checkResultAnim();
        this.node.removeFromParent();
    },

    show: function show(paijuUI, paiUdid) {
        this.paijuUI = paijuUI;
        this.paiUdid = paiUdid;
        this.animManager.setAnimation(0, "Huguang", false);
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
        //# sourceMappingURL=mjDpaoUI.js.map
        