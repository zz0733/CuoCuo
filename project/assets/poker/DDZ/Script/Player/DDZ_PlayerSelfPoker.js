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
        },
    },


    onLoad () {
        this._pos = cc.p(30, -250);
        this._cardsList = [];
        this.node.getComponent(cc.Layout).spacingX = this._pokerMargin;
    },
    clearHandPoker: function () {
        this.node.removeAllChildren();
        this._cardsList= [];
    },
    initHandPoker: function (handPokerListID,isNewFaPai) {
        this.clearHandPoker();
        this.handPokerIDs = handPokerListID;
        this.selfPlayerHandPoker = [];
        handPokerListID = cc.YL.DDZTools.SortPoker(handPokerListID);
        for (var i = 0; i < handPokerListID.length; i++) {
            var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(handPokerListID[i]);
            this.selfPlayerHandPoker.push(pokerObj);
        }
        this.selfPlayerHandPoker = this._sortPokerArrObj(this.selfPlayerHandPoker);
        this.selfPlayerHandPoker.reverse();
        cc.YL.DDZHandPokerList = this.selfPlayerHandPoker;
        this._updateHandPoker(this.selfPlayerHandPoker,isNewFaPai);
        cc.YL.DDZPokerTip.startAnalysis();// 出牌更新玩家当前手牌后，分析手牌
    },
    _sortPokerArrObj: function (selfPlayerHandPoker) {
        return selfPlayerHandPoker.sort(function (a, b) {
            return a.Num - b.Num
        });

    },
    _updateHandPoker: function (pokerList,isNewFaPai) {
        for (var i = 0; i < pokerList.length; i++) {
            var pokerNode = cc.instantiate(this.pokerPrefab);
            pokerNode.getComponent("DDZ_Poker").initPoker(pokerList[i]);
            pokerNode.setScale(this._scale);
            pokerNode.setPositionY(0);
            pokerNode.setTag(i);
            if (i == (pokerList.length - 1 )) {
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = true;
            } else {
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = false;
            }
            if (cc.YL.loaderID == cc.YL.DDZselfPlayerInfo.userId
                && i == (pokerList.length - 1 )) {
                pokerNode.getChildByName("OwnerSign").active = true;
            } else {
                pokerNode.getChildByName("OwnerSign").active = false;
            }
            if(isNewFaPai == true){
                pokerNode.active  = false;
            }
            this.node.addChild(pokerNode);
            this._cardsList.push(pokerNode);
        }
        this.node.setPosition(cc.p(30, -250));
        if(isNewFaPai == true){
            this.node.parent.getChildByName("HandPokerTouch").active = false;
        }else{
            this.setTouchEvent(true);
        }

    },
    setTouchEvent: function (isTouch) {
        var children = this.node.children;
        for (var i = 0; i < children.length; i++) {
            children[i].setPositionY(0);
        }
        cc.YL.playerOutPokerArr = [];
        if (isTouch == false) {
            this.node.parent.getChildByName("HandPokerTouch").active = false;
            var children = this.node.children;
            for (var i = 0; i < children.length; i++) {
                children[i].getChildByName("Cover").active = true;
            }
        } else {
            var BtnNode = cc.find("DDZ_UIROOT/MainNode/PlayerBtnNode");
            if(BtnNode.getChildByName("DDZ_Pass")){
                this.node.parent.getChildByName("HandPokerTouch").active = false;
                var children = this.node.children;
                for (var i = 0; i < children.length; i++) {
                    children[i].getChildByName("Cover").active = true;
                }
            }else{
                this.node.parent.getChildByName("HandPokerTouch").active = true;
                var children = this.node.children;
                for (var i = 0; i < children.length; i++) {
                    children[i].getChildByName("Cover").active = false;
                }
            }

        }


    },


});
