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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on("touchend", this.onEndTouch.bind(this), this.node);
        this.node.on("touchcancel", this.onCancelTouch.bind(this), this.node);
        this.node.on("touchmove", this.onMoveTouch.bind(this), this.node);
        this.node.on("touchstart", this.onStartTouch.bind(this), this.node);
        this.pokerSourceHeight = 0;
        this.pokerUpHeight = 20;
        this.pokerSpacing = 50;
        this.clickFirstPos = 147.5;
        this.posYMin = 20;
        this.posYMax = 230;
        cc.YL.playerOutPokerArr = [];

    },
    update: function () {
        this.node.setPosition(this.node.parent.getChildByName("HandPoker").getPosition());
        this.node.width = this.node.parent.getChildByName("HandPoker").width + 150;
        this.node.height = this.node.parent.getChildByName("HandPoker").height + 10;
        this.node.scale = this.node.parent.getChildByName("HandPoker").scale;
    },
    onStartTouch: function (event) {
        this.startTouchPos = event.getStartLocation();
    },
    onCancelTouch: function (event) {
        this.endTouchPos = event.getLocation();
        this.clickPoker();
    },
    onMoveTouch: function (event) {
        var moveTouchPos = event.getLocation();
        if (moveTouchPos.y >= this.posYMin && moveTouchPos.y <= this.posYMax) {
            // 滑动y轴的有效范围
            //记录在有效的范围里面，最后的坐标
            this.moveTouchPos = moveTouchPos;
            if (this.moveTouchPos.y >= this.posYMin && this.moveTouchPos.y <= this.posYMax) {
                // 最后结束的时候，y坐标在牌里面，视为成功，否则用滑动中最后一次的坐标
                var delatX = this.moveTouchPos.x - this.startTouchPos.x;
                var index_1 = this.caculateIndex(this.startTouchPos.x);
                var index_2 = this.caculateIndex(this.moveTouchPos.x);
            }
            if (delatX == 0) {
                //单击一次手牌
                var pokerIndex = this.caculateIndex(this.moveTouchPos.x);
                this.node.parent.getChildByName("HandPoker").getChildByTag(pokerIndex).getChildByName("Cover").active = true;
            } else if (delatX > 0) {
                for (var i = index_1; i <= index_2; i++) {
                    this.node.parent.getChildByName("HandPoker").getChildByTag(i).getChildByName("Cover").active = true;
                }
                //从左向右
            } else if (delatX < 0) {
                //从右向左
                for (var i = index_2; i <= index_1; i++) {
                    if(i>= 0 && i < this.node.parent.getChildByName("HandPoker").children.length){
                        this.node.parent.getChildByName("HandPoker").getChildByTag(i).getChildByName("Cover").active = true;
                    }
                }
            }

        }
    },
    onEndTouch: function (event) {
        this.endTouchPos = event.getLocation();
        var childNodeList = this.node.parent.getChildByName("HandPoker").children;
        for(var i = 0; i < childNodeList.length;i++){
            childNodeList[i].getChildByName("Cover").active = false;
        }
        this.clickPoker();
    },
    // update (dt) {},
    clickPoker: function () {
        cc.YL.DDZAudio.playCommonBGM(2);
        // 从左到右的起点坐标
        if (this.endTouchPos.y >= this.posYMin && this.endTouchPos.y <= this.posYMax) {
            // 最后结束的时候，y坐标在牌里面，视为成功，否则用滑动中最后一次的坐标
            var delatX = this.endTouchPos.x - this.startTouchPos.x;
            var index_1 = this.caculateIndex(this.startTouchPos.x);
            var index_2 = this.caculateIndex(this.endTouchPos.x);
        } else {
            var delatX = this.moveTouchPos.x - this.startTouchPos.x;
            var index_1 = this.caculateIndex(this.startTouchPos.x);
            var index_2 = this.caculateIndex(this.moveTouchPos.x);
        }
        if (delatX == 0) {
            //单击一次手牌
            var pokerIndex = this.caculateIndex(this.endTouchPos.x);
            if (this.node.parent.getChildByName("HandPoker").getChildByTag(pokerIndex).y == this.pokerUpHeight) {
                this.node.parent.getChildByName("HandPoker").getChildByTag(pokerIndex).y = this.pokerSourceHeight;
            } else {
                this.node.parent.getChildByName("HandPoker").getChildByTag(pokerIndex).y = this.pokerUpHeight;
            }
        } else if (delatX > 0) {
            for (var i = index_1; i <= index_2; i++) {
                if (this.node.parent.getChildByName("HandPoker").getChildByTag(i).y == this.pokerUpHeight) {
                    this.node.parent.getChildByName("HandPoker").getChildByTag(i).y = this.pokerSourceHeight;

                } else {
                    this.node.parent.getChildByName("HandPoker").getChildByTag(i).y = this.pokerUpHeight;
                }
            }
            //从左向右
        } else if (delatX < 0) {
            //从右向左
            for (var i = index_2; i <= index_1; i++) {
                if(i>= 0 && i < this.node.parent.getChildByName("HandPoker").children.length) {
                    if (this.node.parent.getChildByName("HandPoker").getChildByTag(i).y == this.pokerUpHeight) {
                        this.node.parent.getChildByName("HandPoker").getChildByTag(i).y = this.pokerSourceHeight;

                    } else {
                        this.node.parent.getChildByName("HandPoker").getChildByTag(i).y = this.pokerUpHeight;

                    }
                }
            }
        }
        var childNodeList = this.node.parent.getChildByName("HandPoker").children;
        for(var i = 0; i < childNodeList.length;i++){
            childNodeList[i].getChildByName("Cover").active = false;
        }
        cc.YL.info("重制手牌节点的cover为false");
        cc.YL.playerOutPokerArr = [];
        var children = this.node.parent.getChildByName("HandPoker").children;
        for(var i = 0; i < children.length;i++){
            if(children[i].y == this.pokerUpHeight){
                cc.YL.playerOutPokerArr.push(children[i].getComponent("DDZ_Poker").pokerID);
            }
        }

    },

    caculateIndex: function (posX) {
        var childrenLen = this.node.parent.getChildByName("HandPoker").children.length;
        var firstPos = (20 - childrenLen) * (this.pokerSpacing / 2) + this.clickFirstPos;
        var pokerIndex = parseInt((posX - firstPos) / this.pokerSpacing);
        pokerIndex = pokerIndex < this.node.parent.getChildByName("HandPoker").children.length
            ? pokerIndex
            : this.node.parent.getChildByName("HandPoker").children.length - 1;
        return pokerIndex;
    },

});
