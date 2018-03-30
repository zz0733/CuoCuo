// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        pokerPre: cc.Prefab,
    },


    onLoad () {
        this._childScale = 0.25;
        this._diPaiArr = [];
        this._diPaiPosArr = [cc.p(-41, 0), cc.p(0, 0), cc.p(41, 0)];
    },

    clearDiPai: function () {
        this.node.removeAllChildren();
        this.node.active = false;
    },
    initDiPai: function (list) {
        var lists = cc.YL.DDZTools.SortPoker(list);
        this._diPaiArr = lists;
        for (var i = 0; i < lists.length; i++) {
            var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(lists[i]);
            var newNode = cc.instantiate(this.pokerPre);
            newNode.setScale(this._childScale);
            newNode.setPosition(this._diPaiPosArr[i]);
            newNode.getComponent("DDZ_Poker").initPoker(pokerObj);
            this.node.addChild(newNode);
        }
        this.node.active = true;

    },
});
