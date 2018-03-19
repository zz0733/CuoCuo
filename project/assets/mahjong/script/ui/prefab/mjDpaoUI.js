cc.Class({
    extends: cc.Component,

    properties: {
       spineNode : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.animManager = this.spineNode.getComponent(sp.Skeleton)
        var self = this;
        var completeCB = function(){
            self.onAnimCompleted();
            self.paijuUI.removeDachuPai(self.paiUdid);
        }
        this.animManager.setCompleteListener(completeCB);
    },

    onAnimCompleted : function(){
        var gameManager = require("mjGameManager");
        gameManager.checkResultAnim();
        this.node.removeFromParent();
    },

    show : function(paijuUI, paiUdid){
        this.paijuUI = paijuUI;
        this.paiUdid = paiUdid;
        this.animManager.setAnimation(0, "Huguang", false);
    },
});
