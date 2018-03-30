cc.Class({
    extends: cc.Component,

    properties: {
        selfPlayerHandPoker: [],
        handPokerIDs: [],
        _scale: 1,
        _pokerMargin: 50,
        pokerPrefab: {
            type: cc.Prefab,
            default: null,
        }
    },


    onLoad () {
        this._pos = cc.p(30, -250);
        this._cardsList = [];
        this._cardsPool = new cc.NodePool();
        for (var i = 0; i < 20; i++) {
            var card = cc.instantiate(this.pokerPrefab);
            this._cardsPool.put(card);
        }
        this.node.getComponent(cc.Layout).spacingX = this._pokerMargin;
    },
    clearHandPoker: function () {
        if (!this._cardsList) {
            return;
        }
        for (var i = 0; i < this._cardsList.length; i++) {
            this._cardsPool.put(this._cardsList[i]);
        }
        this._cardsList.splice(0, this._cardsList.length);
    },
    initHandPoker: function (handPokerListID) {
        this.clearHandPoker();
        this.handPokerIDs = handPokerListID;
        this.selfPlayerHandPoker = [];
        handPokerListID = cc.YL.DDZTools.SortPoker(handPokerListID);
        for (var i = 0; i < handPokerListID.length; i++) {
            var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(handPokerListID[i]);
            this.selfPlayerHandPoker.push(pokerObj);
        }
        this.selfPlayerHandPoker = this._sortPokerArrObj(this.selfPlayerHandPoker);
        cc.YL.DDZHandPokerList = this.selfPlayerHandPoker;
        this._updateHandPoker(this.selfPlayerHandPoker);
        cc.YL.PokerTip.startAnalysis();// 出牌更新玩家当前手牌后，分析手牌
    },
    _sortPokerArrObj: function (selfPlayerHandPoker) {
        return selfPlayerHandPoker.sort(function (a, b) {
            return a.Num - b.Num
        });

    },
    _updateHandPoker: function (pokerList) {
        for (var i = 0; i < pokerList.length; i++) {
            var pokerNode = this._cardsPool.get();
            pokerNode.getComponent("DDZ_Poker").initPoker(pokerList[i]);
            pokerNode.setScale(this._scale);
            pokerNode.setPositionY(0);
            pokerNode.setTag(i);
            this.node.addChild(pokerNode);
            this._cardsList.push(pokerNode);
        }
        this.node.setPosition(this._pos);
    },

});
