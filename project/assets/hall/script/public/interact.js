const interactCfg = {
    "Jidan"  : {node:"liwu_0"},
    "Tuoxie" : {node:"liwu_0"},
    "Hua"    : {node:"liwu_1"},
    "Wen"    : {node:"liwu_1"},
    "Bianpao": {node:"liwu_2"},
    "Hongbao": {node:"liwu_2"},
    "Xueqiu" : {node:"liwu_2"},
    "Shoulei": {node:"liwu_3"},
    "Yan"    : {node:"liwu_3"},
}  
let Audio = require('Audio');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    // onLoad () {},

    start () {

    },
    // update (dt) {},

    show(data, startWorldPos, endWoldPos){
        this.hideAll();
        var startPos         = this.node.convertToNodeSpaceAR(startWorldPos);
        var endPos           = this.node.convertToNodeSpaceAR(endWoldPos);
        var nodeName         = interactCfg[data.content].node
        this.animNode        = this.node.getChildByName(nodeName);
        this.animNode.active = true;
        this.animNode.setPosition(startPos);
        this.spAnim          = this.animNode.getComponent(sp.Skeleton)
        var moveTime         = cc.pDistance(startPos, endPos)/1500;
        var moveAct          = cc.sequence(cc.moveTo(moveTime, endPos), cc.callFunc(function(){
            Audio.playEffect('hall', data.content + '.mp3');
            this.moveActEnd(data);
        }.bind(this)))
        this.animNode.runAction(moveAct);
        this.spAnim.setAnimation(0, data.content +"_fei", true);
    },

    hideAll(){
        this.node.children.forEach(function(child){
            child.active = false;
        })
    },

    moveActEnd(data){
        this.spAnim.setCompleteListener(this.close.bind(this));
        this.spAnim.setAnimation(0, data.content +"_dao", false);
    },

    close(){
        this.node.removeFromParent();
    },


    
});
