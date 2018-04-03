cc.Class({
    extends: cc.Component,

    properties: {
        pokerPre: cc.Prefab,
        atlas: cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initItem: function (data, headUrl, nickname) {
        // optional int64 userId = 1;
//             optional int32 score = 2; //单局得分
//             optional int32 totalScore = 3; //总得分
//             optional int32 rate = 4; //倍数
//             optional int32 boomCount = 5; //炸弹数量
//             optional bool isWinner = 6; //是否是赢家
//             repeated int32 handPokers = 7; //手牌
//             repeated int32 remainPokers = 8; //剩余手牌
//             optional bool isDiZhu = 9; //是否是地主
//             optional string extend = 10; //扩展字段
        if (data.isDiZhu == true) {
            this.node.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame("dz_xiaojiesuan1");
            this.node.getChildByName("Icon").getChildByName("Word").getComponent(cc.Label).string = "地主"
        } else {
            this.node.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = null;
            this.node.getChildByName("Icon").getChildByName("Word").getComponent(cc.Label).string = "农民"
        }
        fun.utils.loadUrlRes(headUrl, this.node.getChildByName("PlayerInfoBG").getChildByName("Head"));// 头像
        this.node.getChildByName("PlayerInfoBG").getChildByName("ID").getComponent(cc.Label).string = data.userId;
        this.node.getChildByName("PlayerInfoBG").getChildByName("Name").getComponent(cc.Label).string = nickname;
        var pokers = data.handPokers;
        pokers = cc.YL.DDZTools.SortPoker(pokers);
        for (var i = 0; i < pokers.length; i++) {
            var pokerNode = this.initPoker(pokers[i]);
            this.node.getChildByName("PokerBG").getChildByName("HandPoker").addChild(pokerNode);
            var posX = 0 + i * 50;
            pokerNode.setPosition(posX, 0);
            pokerNode.setTag(posX);
        }
        this.node.getChildByName("PokerBG").getChildByName("GameInfo").getComponent(cc.Label).string = data.extend;
        this.node.getChildByName("PokerBG").getChildByName("DiFen").getChildByName("Num").getComponent(cc.Label).string
            = cc.YL.DDZDeskInfo.roomInfo.base;
        this.node.getChildByName("PokerBG").getChildByName("BeiShu").getChildByName("Num").getComponent(cc.Label).string = data.rate;
        if(data.score >= 0){
            this.node.getChildByName("PokerBG").getChildByName("JiFen").getChildByName("Num").getComponent(cc.Label).string = "+" +data.score;
            this.node.getChildByName("PokerBG").getChildByName("JiFen").getChildByName("Num").color  = new cc.Color(255,237,85);
        }else {
            this.node.getChildByName("PokerBG").getChildByName("JiFen").getChildByName("Num").getComponent(cc.Label).string = "-" + data.score;
            this.node.getChildByName("PokerBG").getChildByName("JiFen").getChildByName("Num").color  = new cc.Color(157,186,244);
        }
    },
    initPoker: function (ID) {
        var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(ID);
        var newNode = cc.instantiate(this.pokerPre);
        newNode.getComponent("DDZ_Poker").initPoker(pokerObj);
        return newNode;
    },
    // update (dt) {},
});
