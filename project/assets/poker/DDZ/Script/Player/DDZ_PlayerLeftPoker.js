// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
/*******
 * 左边玩家对于手牌的更新
 * 初始化
 * 等
 * ***/
cc.Class({
    extends: cc.Component,

    properties: {
        cardNum:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initHandPokerCount: function(cardNum){
        cc.YL.info("左边玩家的手牌数",cardNum);
        this.cardNum = cardNum;
        this.node.getChildByName("CardBG").getChildByName("Num").getComponent(cc.Label).string = this.cardNum;
        this.node.getChildByName("CardBG").active = true;
    },
    cleanHandPokerCount: function(){
        this.node.getChildByName("CardBG").getChildByName("Num").getComponent(cc.Label).string = "";
        this.node.getChildByName("CardBG").active = false;
    },
    // update (dt) {},
});
