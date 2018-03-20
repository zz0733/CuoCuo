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
        _selfPlayerHandPoker: [],
        _scale: 1,
        _pos: cc.p(0, -193),
        _pokerMargin: 50,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.setPosition(this._pos);
    },

    initHandPoker: function (handPokerList) {
        this._selfPlayerHandPoker = this.sortHnadPoker(handPokerList);
        this._updateHandPoker(this._selfPlayerHandPoker);
    },
    _updateHandPoker: function (pokerList) {

    },
    sortHnadPoker: function(){
        var temp = [];
        return temp;
    },
});
