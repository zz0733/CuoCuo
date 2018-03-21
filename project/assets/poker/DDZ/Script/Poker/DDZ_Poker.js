// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
/********
 * 单张手牌的挂载
 * 注册touch事件
 * 手牌初始化
 * 运动等
 * *******/
cc.Class({
    extends: cc.Component,

    properties: {
        pokerAtals : cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bindNode();
    },
    bindNode: function () {
        this._bgNode = this.node.getChildByName("BG");
        this._frontNode = this.node.getChildByName("Front");
        this._ownerSign = this.node.getChildByName("OwnerSign");
        this._cardNum = this.node.getChildByName("CardNum");
    },
    initPoker: function (ID) {
        //todo
        this.bindNode();
        this.pokerID = ID;
        var newPokerValue = cc.YL.cardValueTrans.TransPokerValue(10);
        this._frontNode.getComponent(cc.Sprite).spriteFrame = this.pokerAtals.getSpriteFrame(newPokerValue+"");
        this._bgNode.active = false;
        this._frontNode.active = true;
        this._ownerSign.active = false;
        this._cardNum.active = false;
    },
    showBG: function(){
        this._bgNode.active = true;
        this._frontNode.active = false;
        this._ownerSign.active = false;
        this._cardNum.active = false;
    },
    showOwner: function(){
        this._bgNode.active = false;
        this._frontNode.active = true;
        this._ownerSign.active = true;
        this._cardNum.active = false;
    },
    showNum: function(num){
        this._bgNode.active = true;
        this._frontNode.active = false;
        this._ownerSign.active = false;
        this._cardNum.active = true;
        this._cardNum.getComponent(cc.Label).string = num;
    },
    hide: function(type){
        if(type){
            var nodeArr = [this._bgNode,this._frontNode,this._ownerSign,this._cardNum];
            nodeArr[type].active = false;
        }else{
            this._bgNode.active = false;
            this._frontNode.active = false;
            this._ownerSign.active = false;
            this._cardNum.active = false;
        }
    }
    // update (dt) {},
});
