cc.Class({
    extends: cc.Component,

    properties: {
        spineNode : cc.Node,
        contentNode : cc.Node,
        paiNode    : cc.Node,
        // paiPrefab : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this.animanager = this.spineNode.getComponent(sp.Skeleton);
        var self = this;
        var completeFunc = function(){
            self.onAnimCompleted();
        }
        this.animanager.setCompleteListener(completeFunc);
    },

    onAnimCompleted : function(){
        this.node.removeFromParent();
        // this.playerUI.addPai(this.pai);
        setTimeout(function(){
            var gameManager = require("mjGameManager");
            gameManager.checkResultAnim();
        }, 700);       
    },

    show : function(){
        this.animanager.setAnimation(0, "Hu", false);
    },

});
