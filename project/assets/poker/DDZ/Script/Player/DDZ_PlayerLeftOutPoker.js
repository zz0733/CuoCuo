
cc.Class({
    extends: cc.Component,

    properties: {
        outCards:[],
        pokerPre:cc.Prefab,
    },


    start () {

    },
    initOutPoker: function(outcardlist){
        this.outCards = outcardlist;
    },
    clearOutPoker: function(){
        this.node.removeAllChildren();
    },
});
